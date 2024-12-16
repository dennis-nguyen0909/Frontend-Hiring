import { jwtDecode } from "jwt-decode";
import { isJsonString } from "../untils";
import { 
  bagIcon, 
  buldingIcon, 
  jobIcon, 
  companiesIcon, 
  candidateIcon, 
  iconCreate, 
  iconFind, 
  iconUpload, 
  iconApply, 
  grapIcon, 
  codeIcon, 
  digitalIcon, 
  videoIcon, 
  musicIcon, 
  financeIcon, 
  healthyIcon, 
  dataSEIcon 
} from "./iconImport";
export const itemsIcon = [
  {
    icon: bagIcon,
    width: 50,
    height: 50,
    description: "Live Job",
    preview: false,
    amount: "1,75,324",
  },
  {
    icon: buldingIcon,
    width: 50,
    height: 50,
    description: "Công ty",
    preview: false,
    amount: "97,354",
  },
  {
    icon: bagIcon,
    width: 50,
    height: 50,
    description: "New Việc làm",
    preview: false,
    amount: "7,532",
  },
];
export const menuHeader = [
  {
    name: "Trang chủ",
    id:'home',
    path: "/",
    color:"#5E6670",
    colorHover:"#205faf",
    candidate:true,
    employer:true
  },
  {
    name: "Profile & CV",
    id:'profile_cv',
    path: "/profile-cv",
    color:"#5E6670",
    colorHover:"#205faf",
    candidate:true,
    employer:false
    
  },
  {
    name: "Việc làm",
    id:'jobs',
    path: "/jobs",
    color:"#5E6670",
    colorHover:"#205faf",
    candidate:true,
    employer:true
  },
  {
    name: "Công ty",
    id:'employers',
    path: "/employers",
    color:"#5E6670",
    colorHover:"#205faf",
    candidate:true,
    employer:true
  },
  {
    name: "Về chúng tôi",
    id:'about',
    path: "/about",
    color:"#5E6670",
    colorHover:"#205faf",
    candidate:true,
    employer:true
  },
  {
    name: "Dashboard",
    id:'dashboard',
    path: "/dashboard/:id",
    color:"#5E6670",
    colorHover:"#205faf",
    candidate:true,
    employer:true
  },
];

// export const menuHeader = [
//   {
//     name: "Việc làm",
//     path: "/",
//     color:"#5E6670",
//     colorHover:"#205faf"
    
//   },
//   {
//     name: "Hồ Sơ & CV",
//     path: "/find-job",
//     color:"#5E6670",
//     colorHover:"#205faf"
//   },
//   {
//     name: "Công Cụ",
//     path: "/employers",
//     color:"#5E6670",
//     colorHover:"#205faf"
//   },
//   {
//     name: "Cẩm Nang Nghề Nghiệp",
//     path: "/candidates",
//     color:"#5E6670",
//     colorHover:"#205faf"
//   },
//   {
//     name: "TOP CV",
//     path: "/pricing-plans",
//     color:"#5E6670",
//     colorHover:"#205faf"
//   },
//   {
//     name: "Customer Supports",
//     path: "/customer-supports",
//     color:"#5E6670",
//     colorHover:"#205faf"
//   },
// ];

export const suggestion = [
  { name: "Designer", color: '#474C54' },
  { name: "Programing", color: '#474C54' },
  { name: "Digital Marketing", color: '#0A65CC' },
  { name: "Video", color: '#474C54' },
  { name: "Animation", color: '#474C54' }
];

export const jobItems = [
  {
    name: "Live Job",
    color: '#474C54',
    count: '1,75,324',
    image: jobIcon,
  },
  {
    name: "Công ty",
    color: '#474C54',
    count:'97,354',
    image: companiesIcon
  },
  {
    name: "Candidates",
    color: '#0A65CC',
    count:'38,47,154',
    image: candidateIcon
  },
  {
    name: "New Việc làm",
    color: '#474C54',
    count:'7,532',
    image: jobIcon
  }
]

export const vacancies = [
  {
    name:"Anesthesiologists",
    amount:"45,904",
    position: "Open Positions"
  },
  {
    name:"Surgeons",
    amount:"50,364",
    position: "Open Positions"
  },
  {
    name:"Obstetricians-Gynecologists",
    amount:"45,904",
    position: "Open Positions"
  },
  {
    name:"Orthodontists",
    amount:"45,904",
    position: "Open Positions"
  },
  {
    name:"Maxillofacial Surgeons",
    amount:"45,904",
    position: "Open Positions"
  },
  {
    name:"Software Developer",
    amount:"45,904",
    position: "Open Positions"
  },
  {
    name:"Psychiatrists",
    amount:"45,904",
    position: "Open Positions"
  },
  {
    name:"Data Scientist",
    amount:"45,904",
    position: "Open Positions"
  },
  {
    name:"Financial Manager",
    amount:"45,904",
    position: "Open Positions"
  },
  {
    name:"Management Analysis",
    amount:"45,904",
    position: "Open Positions"
  },
  {
    name:"IT Manager",
    amount:"45,904",
    position: "Open Positions"
  },
  {
    name:"Operations Research Analysis",
    amount:"45,904",
    position: "Open Positions"
  },

]


export const jobpilots = [
  {
    name:"Create account",
    icon :iconCreate,
    description:"Aliquam facilisis egestas sapien, nec tempor leo tristique at.",
    isBg:false,
  },
  {
    name:"Upload CV/Resume",
    icon :iconUpload,
    description:"Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales",
    isBg:true,

  },
  {
    name:"Find suitable job",
    icon :iconFind,
    description:"Phasellus quis eleifend ex. Morbi nec fringilla nibh..",
    isBg:false,

  },
  {
    name:"Apply job",
    icon :iconApply,
    description:"Curabitur sit amet maximus ligula. Nam a nulla ante, Nam sodales purus.",
    isBg:false,

  },
]

export const popularCategorys = [
  {
    name:"Graphics & Design",
    amount:"45,904",
    position: "Open Positions",
    icon:grapIcon
  },
  {
    name:"Code & Programing",
    amount:"50,364",
    position: "Open Positions",
    icon:codeIcon
  },
  {
    name:"Digital Marketing",
    amount:"45,904",
    position: "Open Positions",
    icon:digitalIcon
  },
  {
    name:"Video & Animation",
    amount:"45,904",
    position: "Open Positions",
    icon:videoIcon
  },
  {
    name:"Music & Audio",
    amount:"45,904",
    position: "Open Positions",
    icon:musicIcon
  },
  {
    name:"Account & Finance",
    amount:"45,904",
    position: "Open Positions",
    icon:financeIcon
  },
  {
    name:"Health & Care",
    amount:"45,904",
    position: "Open Positions",
    icon:healthyIcon
  },
  {
    name:"Data & Science",
    amount:"45,904",
    position: "Open Positions",
    icon:dataSEIcon
  }
]


export const handleDecoded = (token: any) => {
  let decoded = {};
  try {
    if (token) {
      // Decode the JWT token directly
      decoded = jwtDecode(token);
    }
  } catch (error) {
    console.error("Invalid token:", error);
  }
  return { decoded, token };
};