import { prisma } from "../lib/prisma";
import { Role } from "../types/type";

const seedAdmin = async () => {

    const adminData = {
        name: process.env.NAME,
        email: process.env.EMAIL ,
        role: Role.ADMIN,
        password: process.env.PASSWORD
    }
console.log("seeding function hit");
    if(typeof adminData.email!=="string"||typeof adminData.name!=="string"||typeof adminData.password!=='string'){
       throw new Error("you must full fill the admin data")
    }


    try {
        //is the user exist on db
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })

        if (existingUser) {
            throw new Error("the user is already exists!")
        }

        //create the admin data

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            }, body: JSON.stringify(adminData)
        })
        if (signUpAdmin.ok) {
            const result = prisma.user.update({
                where: {
                    email: adminData.email
                }, data: {
                    emailVerified: true
                }

            })
            console.log("success the admin seeding");
            return result
        }
    } catch (error) {
        console.log(error);
    }
};

 seedAdmin();