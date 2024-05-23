const { query, mutation, setReturn, payload, responseQuery, tokenToData } = mdapi;
const {
    offset = 0,
    limit = 0,
    model = "scoregoods_order",
    structure = {
        "id": "序号",
        "scoregoods": {
            "name": "产品名称"
        },
        "consignee": "收货人名称",
        "phone": "收货人电话",
        "specialArr": [{
            "TableHeader": "收货地址",
            "fields": ["province", "city", "area", "address_detail"]
        }],
        "pay_amount": "实付积分",
        "num": "购买数量",
        "deliver_name": "快递名称",
        "deliver_number": "快递单号",
        "process_status": "订单状态"
    }
} = payload;
const num = (offset - 1) * limit + limit;
const objects = query({
    model,
    ...num > 0 ? {
        offset: offset - 1,
        limit: num
    } : {},
    fields: convertStructure(structure),
})
return {
    objects: objects,
    schema: convertToObjectColumns(objects[0], structure),
}
function convertStructure(obj, result = []) {
    Object.keys(obj).reduce((fields, keys) => {
        const info = obj[keys];
        if (!info) return fields;
        if (Array.isArray(info)) info.forEach(item => result.push(...item.fields));//直接获取合并数组中的字段
        // 如果当前属性是对象，则递归处理 
        else if (typeof info === 'object') {
            const { inputs = {}, ...dataInfo } = info
            result.push({
                action_name: keys, // 假设action_name就是键名  
                inputs,
                fields: []
            });
            // 递归调用，并将'key'添加到路径中  
            convertStructure(dataInfo, result[result.length - 1].fields);
        }
        else result.push(keys); // 如果路径为空，说明是顶级属性，直接添加到结果数组中  
        // 返回处理后的结果数组
    }, [])
    return result
}

function convertToObjectColumns(obj, columnObj = {}, prefix = "") {
    return Object.keys(columnObj).reduce((schema, keys) => {
        const column = columnObj[keys];
        if (Array.isArray(column)) schema.push(...column.map(res => {
            return {
                column: res.TableHeader,
                type: "String",
                value: res.fields.reduce((str, field) => {
                    return str += `item.${prefix}${field} +`;
                }, 'item =>').slice(0, -1) + `|| ''`
            }
        }))
        else if (typeof column === 'object') schema.push(...convertToObjectColumns(obj[keys], column, `${prefix}${keys}.`));
        else {
            const info = obj[keys];
            const type = getObjectType(info);
            // 对于对象和数组，value 属性返回的字符串形式的函数会调用 JSON.stringify 来转换值  
            const valueFunc = (typeof info === 'object' && info !== null)
                ? `item => JSON.stringify(item.${prefix}${keys})`
                : `item => item.${prefix}${keys} || ''`;
            schema.push({
                column: column,
                type: type,
                value: valueFunc
            })
        }
        return schema
    }, [])
}

function getObjectType(obj) {
    if (typeof obj === 'string') return 'String';
    if (typeof obj === 'number') return 'Number';
    if (typeof obj === 'boolean') return 'Boolean';
    if (obj instanceof Date) return 'Date';
    // 如果不是以上类型，统一返回 'String'  
    return 'String';
}
