/* tslint:disable */
import 'tsconfig-paths/register'
import 'reflect-metadata'

import * as bcrypt from 'bcrypt'

import R from 'ramda'

import db from '@/db'

import * as faker from 'faker'

Object.assign(faker, {
    locale: 'pt_BR'
})

import {User, Instance, Customer, CustomerPhone, CustomerEmail} from '@/entity'

const randonElement = <T>(arr: T[]): T => {
    if (arr.length < 1) return null;

    return arr[Math.floor(Math.random() * arr.length)]
}

const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


db.then(async (conn) => {
    const instance1 = await Instance.create({
        name: 'Test 1',
        createdAt: new Date()
    }).save()

    const instance2 = await Instance.create({
        name: 'Test 2',
        createdAt: new Date()
    }).save()

    const instance3 = await Instance.create({
        name: 'Test 3',
        createdAt: new Date()
    }).save()

    const instances = [instance1, instance2, instance3]

    const password = bcrypt.hashSync('123456', 12)

    const users = []

    for (const i of R.range(1, 15)) {
        users.push(await User.create({
            email: `user${i}@aprove`,
            name: `User ${i}`,
            password,
            createdAt: new Date(),
            instance: randonElement(instances)
        }).save())
    }

    for (const _ of R.range(1, 100)) {
        const x = await Customer.create({
            name: faker.name.findName(),
            notes: faker.lorem.words(random(0, 300)),
            document: faker.random.alphaNumeric(16),
            type: randonElement(['NATURAL', 'JURIDICAL']),
            streetName: faker.address.streetName(),
            streetNumber: random(1, 10000).toString(),
            complementary: faker.address.secondaryAddress(),
            neighborhood: faker.address.county(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            zipcode: faker.address.zipCode(),
            status: 'ACTIVE',
            createdAt: new Date(),
            instance: randonElement(instances),
            user: randonElement(users)
        }).save()

        for (let ii = 0; ii < random(0, 3); ii++) {
            const regionalCode = faker.random.arrayElement([11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99])
            await CustomerPhone.create({
                customerId: x.id,
                phone: faker.phone.phoneNumber(`+55${regionalCode}########`)
            }).save()
        }

        for (let ii = 0; ii < random(0, 6); ii++) {
            await CustomerEmail.create({
                customerId: x.id,
                email: faker.internet.email()
            }).save()
        }
    }

    process.exit(0)
})
