import { Notyf } from "notyf";

class Notify {

    private notification = new Notyf({ 
        duration: 4000, 
        position: { x: "right", y: "bottom" },
        types: [
            {
              type: 'success',
              background: '#8d8d8d',
              dismissible: true
            },
            {
              type: 'error',
              background: '#ff4c2c',
              dismissible: true
            }
          ]
    })

    public success(message: string) {
        this.notification.success(message);
    }
    
    public error(err: any) {
        const message: string = this.extractMessage(err);
        this.notification.error(message);
    }

    private extractMessage(err: any): string {

        if(typeof err === "string") {
            return err;
        }
        
        if(typeof err?.response?.data === "string") {
            return err.response.data;
        }

        if (typeof err?.response?.data?.message === "string") {
            if(err.response.status === 401) {
                return "You are not authorized, you need to login again";
            }
            return err.response.data;
        }

        if(Array.isArray(err?.response?.data)) {
            return err.response.data[0];
        }
        
        if(typeof err?.message === "string") {
            return err.message;
        }

        return "An error occurred, please try again.";
    }
}

const notify = new Notify();

export default notify;