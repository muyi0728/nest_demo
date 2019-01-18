import * as crypto from 'crypto'
import { Model } from 'mongoose'

/**
 * 加密
 *
 * @export
 * @param data {string}
 * @returns
 */
export function cryptData(data: string) {
    const md5 = crypto.createHash('md5')
    return md5.update(data).digest('hex')
}

/**
 * 根据条件检查数据库中是否已存在该数据
 *
 * @export
 * @param model
 * @param conditions
 * @returns
 */
export async function isDocumentExist(model: Model<any>, conditions: { [key: string]: any }) {
    try {
        const count = await model.countDocuments(conditions)
        return count > 0
    } catch (err) {
        throw err
    }
}

export interface ResData {
    data: any
    msg: string
    code: number,
    status: Boolean,
}

/**
 * 生成api返回的数据
 *
 * @export
 * @param data
 * @param msg
 * @param code
 * @param status
 * @returns
 */
export function createResData(data: any, msg = 'success', code = 0, status = true): ResData {
    return { data, msg, code, status }
}
