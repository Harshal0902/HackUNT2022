import hash from "hash-sdk";

export default {

    init: async () => {
        try {
            await hash.setProvider("software");
            const accountData = {
                accountId: process.env.ACCOUNT_ID,
                network: process.env.NETWORK,
                keys: {
                    privateKey: process.env.PRIVATE_KEY
                },
                mnemonics: "",
            };
            await hash.setAccount(accountData);
        } catch (e) {
            console.log("Error in intializing account:::", e);
            throw e;
        }
    },

    scHelloWorld: {
        update: async (newMessage) => {
            const data = {
                memo: "smart contract call",
                contractid: "0.0.28595",
                abi: [{ "constant": false, "inputs": [{ "name": "newMessage", "type": "string" }], "name": "update", "payable": false, "stateMutability": "nonpayable", "type": "function", "contractId": { "contract": 28595, "realm": 0, "shard": 0 }, "contractName": "HelloWorld" }],
                params: [newMessage],
                amount: 0
            };
            return await hash.triggerSmartContract(data);
        },

        message: async () => {
            const data = {
                memo: "smart contract call",
                contractid: "0.0.28595",
                abi: [{ "constant": true, "name": "message", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function", "contractId": { "contract": 28595, "realm": 0, "shard": 0 }, "contractName": "HelloWorld" }],
                params: ["afas"],
                amount: 0
            };
            return await hash.triggerSmartContract(data);
        }
    },



    filemyTestFiletxt: {
        fileRetrieve: async () => {
            const data = {
                memo: "file retrieve",
                fileId: "0.0.28596"
            };
            return await hash.triggerFileRetrieve(data);
        }
    },


    topicjustATestTopic: {
        topicUpdate: async (updatedData) => {
            const data = {
                topicId: "0.0.28597"
            };
            if (updatedData.topicName) {
                data.memo = updatedData.topicName;
            }
            if (updatedData.submitKeyList) {
                data.submitKeyList = updatedData.submitKeyList;
            }
            if (updatedData.expirationTime) {
                data.expirationTime = updatedData.expirationTime;
            }
            return await hash.triggerTopicUpdate(data);
        },


        topicInfo: async () => {
            const data = {
                memo: "consensus topic info",
                topicId: "0.0.28597"
            };
            return await hash.triggerTopicInfo(data);
        },


        topicDelete: async () => {
            const data = {
                memo: "consensus topic delete",
                topicId: "0.0.28597"
            };
            return await hash.triggerTopicDelete(data);
        },


        messageSubmit: async (message = " ") => {
            const data = {
                memo: "consensus message submit",
                topicId: "0.0.28597",
                message
            };
            return await hash.triggerSubmitMessage(data);
        }
    },

    hashSdk: hash
};