import { useState } from "react";
import axios from "axios";


const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
function Login({getProducts,setIsAuth}){

    const [formData, setFormData] = useState({
        username:"geno-chen@gmail.com",
        password:"666666"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((preData) => ({
        ...preData,
        [name]:value
        }))
    }

    const onSubmit = async (e) =>{
        try {
            e.preventDefault();
            const response = await axios.post(`${API_BASE}/admin/signin`,formData)
            // console.log(response.data);
            const { token, expired} = response.data;
            document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
            axios.defaults.headers.common['Authorization'] = token;
            getProducts();
            setIsAuth(true);


        } catch (error) {
            setIsAuth(false);
            console.log(error.response)
        }
    }
    return(
      <div className="container login py-4">
        
        <form className="form-floating form-signin bg-info"  onSubmit={(e) => onSubmit(e)}>
          <h1 className='mt-auto text-white'>請輸入帳號密碼</h1>
          <div className="form-floating mb-3 ">
            <input type="email" 
            className="form-control text-primary" 
            id="username"
            name="username" 
            placeholder="name@example.com" 
            value={formData.username}
            onChange={(e) => handleInputChange(e)}
            />
            <label htmlFor="username" className='text-gray'>Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" 
            className="form-control text-primary"
            id="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => handleInputChange(e)}
            />
            <label htmlFor="password" className='text-gray'>Password</label>
          </div>
          <button type='submit' className='btn btn-primary w-100 mt-4' >登入</button>
        </form>
      </div>
    )
}

export default Login