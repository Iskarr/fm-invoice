import { Client, Databases, Account, Storage } from "appwrite";

const client = new Client();
client
  .setEndpoint("http://localhost/v1") // Your API Endpoint
  .setProject("67d2ee74001328e8f1e3"); // Your project ID

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

export { client, databases, account, storage };
