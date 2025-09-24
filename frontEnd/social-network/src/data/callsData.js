
// Mock data
export const callsData = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    phone: "+84 912 345 678",
    avatar: "NVA",
    type: "incoming",
    duration: "5:42",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "online",
    color: "from-violet-500 to-purple-600"
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    phone: "+84 987 654 321",
    avatar: "TTB", 
    type: "missed",
    duration: "Không trả lời",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: "offline",
    color: "from-rose-500 to-pink-600"
  },
  {
    id: 3,
    name: "Lê Minh Châu",
    phone: "+84 901 234 567",
    avatar: "LMC",
    type: "outgoing", 
    duration: "2:18",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: "online",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 4,
    name: "Phạm Thu Dung",
    phone: "+84 934 567 890",
    avatar: "PTD",
    type: "incoming",
    duration: "12:35",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "online",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 5,
    name: "Hoàng Đức Em",
    phone: "+84 945 678 901", 
    avatar: "HĐE",
    type: "outgoing",
    duration: "3:22",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000), // 1 day 2 hours ago
    status: "offline",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 6,
    name: "Võ Thị Lan",
    phone: "+84 956 789 012",
    avatar: "VTL",
    type: "missed", 
    duration: "Không trả lời",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: "online",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 7,
    name: "Phan Văn Nam",
    phone: "+84 967 890 123",
    avatar: "PVN",
    type: "incoming",
    duration: "8:15", 
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: "online",
    color: "from-purple-500 to-violet-600"
  },
  {
    id: 8,
    name: "Ngô Thị Mai",
    phone: "+84 978 901 234",
    avatar: "NTM",
    type: "outgoing",
    duration: "1:45",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago  
    status: "offline",
    color: "from-lime-500 to-green-600"
  }
];