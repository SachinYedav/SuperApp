import config from "@/conf/config";
import { Client, Account } from "appwrite";

export class HealthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async getOverallStatus() {
        try {
            const response = await this.account.get();
            return response ? 'operational' : 'degraded';
        } catch (error) {
            if (error.code === 401) {
                return 'operational';
            }
            return 'down';
        }
    }

}

const healthService = new HealthService();
export default healthService;