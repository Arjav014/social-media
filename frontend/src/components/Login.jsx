import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email:"",
    password:""
  })

  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({...input, [e.target.name]:e.target.value});
  }

  const signUpHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/v1/user/login",input,{
        headers:{
          "Content-Type": "application/json"
        },
        withCredentials:true
      });
      if(res.data.success){
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email:"",
          password:""
        })
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form onSubmit={signUpHandler} className="shadow-lg flex flex-col gap-4 p-8 ">
        <div>
          <div className="flex justify-center items-center">
            <img src="Logo.svg" alt="" className="w-8 h-8"/>
            <h1 className="font-bold text-xl mb-1">Chitchat</h1>
          </div>
          <p className="text-sm text-center">
            Connect, Share, Inspire-It All Begins with You!
          </p>
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent mt-1"
          />
        </div>  
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent mt-1"
          />
        </div>
        {
          loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Please wait
            </Button>
          ) : (
            <Button type="submit">Login</Button>
          )
        }
        <span className="text-center">Don't have an account? <Link to="/signup" className="text-blue-600 font-medium">Signup</Link></span>
      </form>
    </div>
  );
};

export default Login;
