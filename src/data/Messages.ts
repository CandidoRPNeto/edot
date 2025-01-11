
interface TypeMessages {
    loading: string,
    fail: string,
    success: string
}

export class Messages {
    messages: TypeMessages = {
        loading: "",
        fail: "",
        success: ""
    };
    variables: {[key: string]: any} = {};

    constructor(messages: TypeMessages){
        this.messages = messages;
    }

    public setVariables(variables: {}){
        this.variables = variables;
    }

    public loading(): Messages {
        console.log(this.buildMessage(this.messages.loading));
        return this;
    }

    public fail(): Messages {
        console.log(this.buildMessage(this.messages.fail));
        return this;
    }

    public success(): Messages {
        console.log(this.buildMessage(this.messages.success));
        return this;
    }

    private buildMessage(message: string){
        Object.keys(this.variables).forEach(key => {
            message = message.replace(new RegExp(`\\{${key}\\}`, 'g'),this.variables[key]);
        });
        return message;
    }
}