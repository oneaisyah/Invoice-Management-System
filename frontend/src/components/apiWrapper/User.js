import Resource from "./Resource"

class UserResource extends Resource {
    constructor() {
        super('user', 'user');
    }

}

const User = new UserResource();
export default User;