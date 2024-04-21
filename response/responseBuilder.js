class responseBuilder {
    validationResponseBuilder(message){
        const keyValues = message.reduce((acc, item) => {
            const [key, value] = item.msg.split(':').map(part => part.trim());
            acc[key] = value;
            return acc;
        }, {});
        return keyValues;
    }
}

module.exports = new responseBuilder();