import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import logger from 'utils/logger'
import { cryptData } from 'utils/common'
import ServiceExt from 'utils/serviceExt'
import { IUser } from './interface'
import CreateDto from './dto/create.dto'
import ModifyDto from './dto/modify.dto'
import DeleteDto from './dto/delete.dto'
import SearchDto from './dto/search.dto'
import CommodityDto from './dto/commodity.dto'

@Injectable()
export default class UserService extends ServiceExt {
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {
        super()
    }

    async create(createDto: CreateDto) {
        const { account, password } = createDto
        if (!account || !password) {
            logger.error(createDto)
            return this.createResData(null, '参数错误!', 1)
        }
        const isUserExist = await this.isDocumentExist(this.userModel, { account })
        if (isUserExist) {
            return this.createResData(null, '用户已存在!', 1)
        }
        const createdUser = new this.userModel({
            ...createDto,
            password: cryptData(password)
        })
        const user = await createdUser.save()
        return this.createResData(user)
    }

    async modify(modifyDto: ModifyDto) {
        const { _id, account } = modifyDto
        if (!_id) {
            logger.error(modifyDto)
            return this.createResData(null, '参数错误!', 1)
        }
        const theUser = await this.userModel.findOne({ _id })
        if (!theUser) {
            return this.createResData(null, '用户不存在!', 1)
        }
        // user account has changed
        if (theUser.account !== account) {
            const isUserExist = await this.isDocumentExist(this.userModel, { account })
            if (isUserExist) {
                return this.createResData(null, '用户名已存在!', 1)
            }
        }
        const modifyUser = new this.userModel(modifyDto)
        await modifyUser.update(modifyDto)
        return this.createResData('更新成功')
    }

    async delete(deleteDto: DeleteDto) {
        const { _id } = deleteDto
        if (!_id) {
            logger.error(deleteDto)
            return this.createResData(null, '参数错误!', 1)
        }
        const theUser = await this.userModel.findOne({ _id })
        if (!theUser) {
            return this.createResData(null, '用户不存在!', 1)
        }
        if (theUser.account === 'admin') {
            return this.createResData(null, '系统管理员不允许删除!', 1)
        }
        await this.userModel.deleteOne({ _id })
        return this.createResData('删除成功')
    }

    async findUserByAccount(account: string) {
        const user = await this.userModel.findOne({ account })
        return user
    }

    async findAll(searchDto: SearchDto) {
        let { pageSize, pageIndex } = searchDto
        pageSize = Number.isInteger(Number(pageSize)) ? Number(pageSize) : 30
        pageIndex = Number.isInteger(Number(pageIndex)) ? Number(pageIndex) : 1
        // do not send user admin and password of anyone
        const excludeAdmin = { account: { $ne: 'admin', $exists: true } }
        const total = await this.userModel.countDocuments(excludeAdmin)
        const users = await this.userModel
            .find(excludeAdmin, { password: 0 })
            .skip((pageIndex - 1) * pageSize)
            .sort({ createdAt: -1 })
            .limit(pageSize)
        return this.createResData({ total, users })
    }

    getGridNav() {
        return this.createResData([
            {
                imageSrc: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546928865603&di=aec398164318542991df7f126d3ca6f2&imgtype=0&src=http%3A%2F%2Fimage.biaobaiju.com%2Fuploads%2F20180302%2F14%2F1519972369-nWAVZJCeLj.png',
                name: 'Clothing'
            },
            {
                imageSrc: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=288239816,1666615279&fm=26&gp=0.jpg',
                name: 'Shoes'
            },
            {
                imageSrc: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=483923910,2249762937&fm=26&gp=0.jpg',
                name: 'Jewelry'
            },
            {
                imageSrc: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=987902956,2416864043&fm=26&gp=0.jpg',
                name: 'Home'
            },
            {
                imageSrc:
                'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2125782020,1875127433&fm=26&gp=0.jpg',
                name: 'Beauty'
            },
            {
                imageSrc: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4049914013,968433699&fm=26&gp=0.jpg',
                name: 'Bags'
            },
            {
                imageSrc: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1194260752,1962215373&fm=26&gp=0.jpg',
                name: 'New'
            },
            {
                imageSrc: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1399306771,3434479284&fm=26&gp=0.jpg',
                name: 'More'
            }
        ])
    }

    getCarouselList() {
        return this.createResData([
            {
                imageSrc: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=534198674,4032302864&fm=26&gp=0.jpg',
                path: 'test'
            },
            {
                imageSrc: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3180400993,2886560317&fm=26&gp=0.jpg',
                path: 'test'
            },
            {
                imageSrc: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1014350173,2833206539&fm=26&gp=0.jpg',
                path: 'test'
            }
        ])
    }

    getCommodityInfoList(commodityDto: CommodityDto) {
        console.log(commodityDto.pageIndex)
        return this.createResData([
            {
                imageSrc: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1839756543,2965631800&fm=26&gp=0.jpg',
                newPrice: Math.floor(Math.random() * 500 -100 + 100),
                oldPrice:  Math.floor(Math.random() * 1000 -100 + 100),
                stock: Math.floor(Math.random() * 100 -10 + 10)
            },
            {
                imageSrc: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1786378349,2857483659&fm=26&gp=0.jpg',
                newPrice: Math.floor(Math.random() * 500 -100 + 100),
                oldPrice:  Math.floor(Math.random() * 1000 -100 + 100),
                stock: Math.floor(Math.random() * 100 -10 + 10)
            },
            {
                imageSrc: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3429422602,3965382704&fm=11&gp=0.jpg',
                newPrice: Math.floor(Math.random() * 500 -100 + 100),
                oldPrice:  Math.floor(Math.random() * 1000 -100 + 100),
                stock: Math.floor(Math.random() * 100 -10 + 10)
            },
            {
                imageSrc: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=4263412809,2940053296&fm=11&gp=0.jpg',
                newPrice: Math.floor(Math.random() * 500 -100 + 100),
                oldPrice:  Math.floor(Math.random() * 1000 -100 + 100),
                stock: Math.floor(Math.random() * 100 -10 + 10)
            },
            {
                imageSrc: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1210198372,763491737&fm=26&gp=0.jpg',
                newPrice: Math.floor(Math.random() * 500 -100 + 100),
                oldPrice:  Math.floor(Math.random() * 1000 -100 + 100),
                stock: Math.floor(Math.random() * 100 -10 + 10)
            },
            {
                imageSrc: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=975979922,1078275593&fm=26&gp=0.jpg',
                newPrice: Math.floor(Math.random() * 500 -100 + 100),
                oldPrice:  Math.floor(Math.random() * 1000 -100 + 100),
                stock: Math.floor(Math.random() * 100 -10 + 10)
            }
        ])
    }

}
