const fs2 = require('fs');
const convertToJSON = require('./convertToJSON');
const projectId = '536384829187';
const location = 'us'; // Format is 'us' or 'eu'
const processorId = 'a0be4634df51e0ee'; // Create processor in Cloud Console
const fs = require('fs').promises;

const { DocumentProcessorServiceClient } =
    require('@google-cloud/documentai').v1;

// Instantiates a client
// apiEndpoint regions available: eu-documentai.googleapis.com, us-documentai.googleapis.com (Required if using eu based processor)
const client = new DocumentProcessorServiceClient({ apiEndpoint: 'us-documentai.googleapis.com' });
function getExtension(filename) {
    console.log('filename', filename);
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i + 1);
}
async function getEncodedImage(filePath) {
    // Read the file into memory.
    // const imageFile = await fs.readFile(filePath);
    const imageFile = await fs.readFile(filePath)
    fs.unlink(filePath, (err) => {
        if (err) {
            throw err;
        }

        console.log("Delete File successfully.");
    });
    // Convert the image data to a Buffer and base64 encode it.
    const encodedImage = Buffer.from(imageFile).toString('base64');
    return encodedImage;
}
async function uploadImage(request) {
    const [result] = await client.processDocument(request);
    console.log('Document processing complete.');


    const { document } = result;
    return document
}
function createRequestObject(extension, encodedImage) {

    // The full resource name of the processor, e.g.:
    // projects/project-id/locations/location/processor/processor-id
    // You must create new processors in the Cloud Console first
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
    let rawDocument = {
        content: encodedImage,
        mimeType: null,
    };
    if (extension === "pdf")
        rawDocument.mimeType = `application/${extension}`
    else
        throw new Error("File type must be pdf");
    const request = {
        name,
        rawDocument: rawDocument
    };
    return request;
}

function extractData(entities) {
    const extractedData = {};
    let itemCount = 0;
    // extracting entities+their labels and placing them into a nested dict
    for (const entity of entities) {
        console.log(entities);
        if (entity.type === 'line_item') {
            const lineDict = {};
            for (const property of entity.properties) {
                lineDict[`${property.type}${itemCount}`] = {
                    type: property.type,
                    mention_text: property.mentionText,
                    confidence: property.confidence,
                };
            }
            extractedData[`${entity.type}${itemCount}`] = lineDict;
            itemCount += 1;
        } else {
            extractedData[entity.type] = {
                type: entity.type,
                mention_text: entity.mentionText,
                confidence: entity.confidence,
            };
        }
    }
    // return extractedData;
    return convertToJSON(extractedData);
}
function createJSONFileSync(extractedData) {
    // create json file
    const jsonFileData = JSON.stringify(extractedData, null, 4);
    fs2.writeFileSync('output_results.json', jsonFileData);
}
async function run(filePath) {
    const encodedImage = await getEncodedImage(filePath);
    const extension = getExtension(filePath)
    console.log('extension', extension);
    const request = createRequestObject(extension, encodedImage);
    // Recognizes text entities in the PDF document
    const document = await uploadImage(request);
    const entities = document.entities;
    const extractedData = extractData(entities)
    return extractedData;
}

module.exports = { run };