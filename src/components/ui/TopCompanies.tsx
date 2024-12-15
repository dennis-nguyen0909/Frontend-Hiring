import React from "react"

import { useEffect, useState } from "react";
import CompanyCard from "./CompanyCard";
import { JobApi } from "../../services/modules/jobServices";
import { USER_API } from "../../services/modules/userServices";
import { useSelector } from "react-redux";
import { Satellite } from "lucide-react";
import { Meta } from "../../types";
import { ROLE_API } from "../../services/modules/RoleServices";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
const TopCompanies = () => {
    const [companies,setCompanies]=useState([]);
    const [roleEmployer,setRoleEmployer]=useState()
    const [meta,setMeta]=useState<Meta>({})
    const userDetail = useSelector(state=>state.user)
    const navigate =useNavigate()
    const handleGetEmployerRole= async ()=>{
        try {
            const res = await ROLE_API.getEmployerRole(userDetail?.access_token);
            if(res.data){
                setRoleEmployer(res.data._id)
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handleGetAllCompanys = async (query?:any,current=1,pageSize=12) => {
        try {
            const params={
                current,
                pageSize,
                query:{
                    ...query,
                }
            }
          const res = await USER_API.getAllCompany(params,userDetail?.access_token)
          if (res.data) {
            setCompanies(res.data.items);
            setMeta(res.data.meta)
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      useEffect(() => {
        handleGetEmployerRole()
        if(roleEmployer){
            const query={
                role:roleEmployer
            }
            handleGetAllCompanys(query);
        }
      }, [roleEmployer]);
      
      const renderCompanies = ()=>{
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {companies?.map((item,idx)=>{
                        return (
                            <CompanyCard item={item} key={idx}/>
                        )
                    })}
                </div>
            )
      }
    return(
        <>
            <div className="h-full px-5 md:px-primary"> 
                <div>
                    <h1 className="text-textBlack text-3xl font-medium">Top Companies</h1>
                </div>
                <div className="mt-5 mb-5">
                    {renderCompanies()}
                </div>
                <div className="flex items-center justify-center mb-5">
                    <Button onClick={()=>navigate('/employers')}>Xem thêm</Button>
                </div>
            </div>  
        </>
    )
}


export default TopCompanies


  