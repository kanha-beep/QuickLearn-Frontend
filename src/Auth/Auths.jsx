// import { useNavigate } from "react-router-dom";
// import React, { useState } from "react";
// import { handleChange } from "../Components/HandleChange.js";
// import { api } from "../../api.js";
// export default function Auth() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     // role: "",
//   });
//   const [isLogin, setIsLogin] = useState(true);

//   const handleForm = (e) => {
//     handleChange(e, setForm);
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("form data: ", form);
//     try {
//        const url = isLogin ? "/auth/login" : "/auth/register";
//       const res = await api.post(url, form);
//       console.log("response: ", res?.data);
//     } catch (e) {
//       console.log("error: ", e?.status);
//       if (e?.status === 404) {
//         alert(e?.response?.data?.msg);
//         navigate("/");
//         return;
//       }

//       console.error("Error registering user: ", e?.response?.data?.msg);
//     }
//   };
//   console.log(form);
//   return (
//     <div>
//       <button onClick={()=>setIsLogin("/auth/login")}>Login</button>
//       <form onSubmit={handleSubmit}>
//         <input
//           placeholder="email"
//           name="email"
//           type="text"
//           value={form.email}
//           onChange={handleForm}
//         />
//         <input
//           placeholder="password"
//           type="text"
//           name="password"
//           value={form.password}
//           onChange={handleForm}
//         />
//         {/* <select>
//           <option value="">Select Role</option>
//           <option value="user">Student</option>
//           <option value="admin">Admin</option>
//         </select> */}
//          <button type="submit">{isLogin ? "Login" : "Register"}</button>
//       </form>
//     </div>
//   );
// }
