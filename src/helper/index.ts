import bagIcon from "../assets/icons/bag.png";
import buldingIcon from "../assets/icons/building.png";
import jobIcon from '../assets/icons/job.png'
import companiesIcon from '../assets/icons/companies.png'
import candidateIcon from '../assets/icons/candidate.png'
import iconCreate from '../assets/icons/account.png'
import iconFind from '../assets/icons/find.png'
import iconUpload from '../assets/icons/upload.png'
import iconApply from '../assets/icons/apply.png'
import grapIcon from '../assets/icons/grap.png'
import codeIcon from '../assets/icons/code.png'
import digitalIcon from '../assets/icons/digital.png'
import videoIcon from '../assets/icons/video.png'
import musicIcon from '../assets/icons/music.png'
import financeIcon from '../assets/icons/finance.png'
import healthyIcon from '../assets/icons/health.png'
import dataSEIcon from '../assets/icons/data-se.png'
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
    description: "Companies",
    preview: false,
    amount: "97,354",
  },
  {
    icon: bagIcon,
    width: 50,
    height: 50,
    description: "New Jobs",
    preview: false,
    amount: "7,532",
  },
];

export const menuHeader = [
  {
    name: "Home",
    path: "/",
    color:"#5E6670",
    colorHover:"#205faf"
    
  },
  {
    name: "Find Job",
    path: "/find-job",
    color:"#5E6670",
    colorHover:"#205faf"
  },
  {
    name: "Employers",
    path: "/employers",
    color:"#5E6670",
    colorHover:"#205faf"
  },
  {
    name: "Candidates",
    path: "/candidates",
    color:"#5E6670",
    colorHover:"#205faf"
  },
  {
    name: "Pricing Plans",
    path: "/pricing-plans",
    color:"#5E6670",
    colorHover:"#205faf"
  },
  {
    name: "Customer Supports",
    path: "/customer-supports",
    color:"#5E6670",
    colorHover:"#205faf"
  },
];

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
    name: "Companies",
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
    name: "New Jobs",
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