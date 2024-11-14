import React from "react"

import { useEffect, useState } from "react";
import CompanyCard from "./CompanyCard";
import { JobApi } from "../../services/modules/jobServices";
const TopCompanies = () => {
    const [company,setCompany]=useState([]);
    const [pageSize,setPageSize]=useState(8)
    const handleGetAllCompanys = async () => {
        try {
          const res = await JobApi.getAllJobs({pageSize:pageSize})
          if (res.data) {
            setCompany(res.data.items);
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      useEffect(() => {
        handleGetAllCompanys();
      }, []);

      const renderCompanies = ()=>{
            return (
                <div className="mt-[50px] flex flex-wrap gap-3 justify-between ">
                    {company.map((item,idx)=>{
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