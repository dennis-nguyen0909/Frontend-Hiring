import bagIcon from "../assets/icons/bag.png";
import buldingIcon from "../assets/icons/building.png";
import jobIcon from '../assets/icons/job.png'
import companiesIcon from '../assets/icons/companies.png'
import candidateIcon from '../assets/icons/candidate.png'
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