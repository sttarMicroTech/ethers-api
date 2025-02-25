class Utils {
    /**
     * Validador de requisição 
     * do sistema
     * @param {string} route - ID da rota (api/[ID_DA_ROTA])
     * @param {object} body - Corpo da requisição
     * @returns {{status: string, message: string}}
     */
    bodyValidation(route, body) {
        var schema = {
            'create-wallet':        ['network', 'schema'],
            'recover-wallet':       ['network', 'schema', 'pk'],
            'get-balance':          ['network', 'schema', 'wallet'],
            'valid-address':        ['network', 'schema', 'wallet'],
            'last-block':           ['network', 'schema'],
            'send-transaction':     ['network', 'schema', 'to', 'value', 'pk'],
            'show-transaction':     ['network', 'schema', 'hash'],
            'tokenize-transfers':   ['network', 'schema', 'wallet'],
            'tokenize-last-block':  ['network', 'schema']
        };

        var keys = Object.keys(body);

        for(var sch of schema[route]){
            if(!keys.includes(sch)){
                return {
                    status: false,
                    message: `input ${sch} is required!`
                }
            }
        }

        return {
            status: true,
            message: `Match with success!`
        }

    }
}

export default Utils;