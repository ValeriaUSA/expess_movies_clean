import bcrypt from "bcrypt";
import yup from "../../config/yup.config.js";
import userRepository from "../../repositories/user.repository.js"

// Validation 
const userSchema = yup.object().shape({
    email: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),

    password: yup
        .string()
        .required("Password is required")
        .min(8, "At least 8 characters")
        .matches(/[A-Z]/, "Must contain uppercase")
        .matches(/[0-9]/, "Must contain number")
        .matches(/[!@#$%^&*(),.?\":{}|<>]/, "Must contain special character"),
    nom: yup
        .string()
        .required("Last name is required")
        .matches(/^[A-Z]{1}.{2,19}$/, "Last name must start with a capital letter (3–20 chars)"),
    prenom: yup.string().min(3).max(20),
});

// Registeration API

const register = async (req, res) => {
    try {
        await userSchema.validate(req.body, { abortEarly: false });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userToSave = { ...req.body, password: hashedPassword };

        const savedUser = await userRepository.save(userToSave);
        if (!savedUser) return res.status(500).json({ message: "Problem inserting user" });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser.id,
                email: savedUser.email,
                prenom: savedUser.prenom,
                nom: savedUser.nom,
                role: savedUser.role,
            },
        });
    } catch (err) {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.errors || [err.message],
        });
    }
};


// Login API 


const login = async (req, res) => {

    const {email, password} = req.body;

    try {
        const user = await userRepository.findByEmail(email);

        // User with such email non found in DB

        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    errors: ['User not found'],
                }
            );
        }

        // User email is found , lets check the password

        const match = await bcrypt.compare(password, user.password ) //compares (plainPassword, hashedPassword);
        if(!match){
            return res.status(401).json({

                success:false,
                errors : ["Invalid password"],
            })
        }
// User is found and password is OK

return res.json({
    success: true,
    message: "Login is successful",
    user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
    },
})
    }
    catch {err} {
        console.log(err);
        return res.status(500).json({
            success:false,
            errors : ["Unexpected error "],
        })
        
    }
}


export default { register, login};