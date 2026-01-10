import bcrypt from "bcrypt";
import yup from "../config/yup.config.js";
import userRepository from "../repositories/user.repository.js";


// LOGIN part for a USER: 

// Show login page (GET)
const showLogin = (req, res) => {
  res.render("login", { errors: [], values: {} });
};

// Show register page (GET)
const showRegister = (req, res) => {
  res.render("register", { error: [], value: {} })
}

// Handle login submission (POST)
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.render("login", {
        errors: ["User not found"],
        values: { email },
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("login", {
        errors: ["Invalid password"],
        values: { email },
      });
    }

    // Login success: save info in session
    req.session.userId = user.id;
    req.session.firstname = user.prenom;
    req.session.lastname = user.nom;
    req.session.role = user.role;

    if (user.role === "ADMIN") {
      res.redirect("/film");   // admin goes to film management
    } else {
      res.redirect("/");       //  abonne goes to index
    }
  } catch (err) {
    console.error(err);
    res.render("login", {
      errors: ["Unexpected error"],
      values: { email },
    });
  }
};



// Validation check for user registration
const userSchema = yup.object().shape({

  email: yup
    .string()
    .email("Invalid email address") // Must be a valid email format
    .required("Email is required"), // Required field


  password: yup
    .string()
    .required("Password is required") // Required field
    .min(8, "Password must be at least 8 characters") // Minimum length of 8
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter") // At least 1 uppercase
    .matches(/[0-9]/, "Password must contain at least one number") // At least 1 number
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character" // At least 1 special char
    ),


  nom: yup
    .string()
    .required("Last name is required")
    .matches(
      /^[A-Z]{1}.{2,19}$/, // Must start with uppercase and be 3–20 chars long
      "Last name must start with a capital letter and contain between 3 and 20 letters"
    ),


  prenom: yup
    .string()
    .min(
      3,
      (args) =>
        `First name must be at least ${args.min} characters, entered value: ${args.value}`
    )
    .max(20, "First name cannot exceed 20 characters"),
});



// Register (add) a new user
const add = async (req, res, next) => {
  try {

    await userSchema.validate(req.body, { abortEarly: false });

    // Hash password before saving, where 10 (default) is Salt rounds tell bcrypt how many times to process the hashing algorithm.
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Save user in repository
    const userToSave = {
      ...req.body,
      password: hashedPassword,
    };

    const savedUser = await userRepository.save(userToSave);

    if (!savedUser) {
      // If save failed
      res.render("register", {
        errors: ["Problem inserting user"],
        values: req.body,
      });
    } else {
      // Save name in session (for greeting, etc.)
      req.session.firstname = savedUser.prenom;

      console.log("User registered:", savedUser);
      res.redirect("login"); // redirect to login after successful registration
    }
  } catch (err) {
    // Validation or DB errors
    console.error("Database error", err);

    res.render("register", {
      errors: err.errors || ["Unexpected error"],
      values: req.body,
    });
  }
};


//LOG OUT. DELAY of 5 seconds with setTime is not on server side, so will be send to frontend by creating an empty page with alert

// logout controller
const logout = (req, res) => {
  const userName = req.session.firstname || "user"; // get name from session
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return; // just log the error, no redirect
    }
    // Render a small page that shows the alert and redirects
    res.send(`
      <script>
        alert("See you soon, ${userName}!");
        setTimeout(() => {
          window.location.href = "/";
        }, 3000)
      </script>
    `);
  });
};


export default { add, showLogin, showRegister, login, logout};
