import React from "react"

import { useEffect, useState } from "react";
import CompanyCard from "./CompanyCard";
import { JobApi } from "../../services/modules/jobServices";
import { USER_API } from "../../services/modules/userServices";
import { useSelector } from "react-redux";
import { Satellite } from "lucide-react";
import { Meta } from "../../types";
import { ROLE_API } from "../../services/modules/RoleServices";
const TopCompanies = () => {
    const [companies,setCompanies]=useState([]);
    const [roleEmployer,setRoleEmployer]=useState()
    const [meta,setMeta]=useState<Meta>({})
    const userDetail = useSelector(state=>state.user)
    const handleGetEmployerRole= async ()=>{
        try {
            const res = await ROLE_API.getEmployerRole(userDetail?.access_token);
            if(res.data){
                setRoleEmployer(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handleGetAllCompanys = async (query?:any,current=1,pageSize=10) => {
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
        if(roleEmployer?.role_name){
            const query={
                role:roleEmployer?._id
            }
            handleGetAllCompanys(query);
        }
      }, [roleEmployer?.role_name]);
      const renderCompanies = ()=>{
            return (
                <div className="mt-[50px] flex flex-wrap gap-3 justify-between ">
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
            <div className="h-screen px-5 md:px-primary"> 
                <div>
                    <h1 className="text-textBlack text-3xl font-medium">Top Companies</h1>
                </div>
                <div>
                    {renderCompanies()}
                </div>
            </div>  
        </>
    )
}


export default TopCompanies


  