export const  registerFormControls = [
    {
        name: "userName",
        label: "User Name",
        placeholder: "Enter your user name",
        componentType: "input",
        type: "text",
      },
      {
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        componentType: "input",
        type: "email",
      },
      {
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        componentType: "input",
        type: "password",
      },
    ];



export const loginFormControls = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      componentType: "input",
      type: "password",
    },
  ] 


export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "casualwears", label: "Casual Wears" },
      { id: "partywears", label: "Party Wears" },
      { id: "weddingwears", label: "Wedding Wears" },
      
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "sabyasachi", label: "Sabyasachi" },
      { id: "biba", label: "Biba" },
      { id: "manishMalhotra", label: "Manish Malhotra" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
  {
    label: "Sponsored Product",
    name: "isSponsored",
    componentType: "checkbox",
    description: "Brands pay for prominent placement of this product",
  },
  {
    label: "Sponsor Name",
    name: "sponsorName",
    componentType: "input",
    type: "text",
    placeholder: "Brand paying for the sponsorship (optional)",
  },
  {
    label: "Sponsored Until",
    name: "sponsoredUntil",
    componentType: "input",
    type: "date",
    placeholder: "Sponsorship expiry date (optional)",
  },
  {
    label: "Affiliate URL",
    name: "affiliateUrl",
    componentType: "input",
    type: "url",
    placeholder: "Partner shop link, e.g. https://partner.com/item (optional)",
  },
  {
    label: "Affiliate Partner",
    name: "affiliatePartner",
    componentType: "input",
    type: "text",
    placeholder: "Partner name shown on the buy button (optional)",
  },
]


export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "Shop",
    label: "Shop",
    path: "/shop/listing",
  },
  {
    id: "About",
    label: "About",
    path: "/shop/about",
  },
  {
    id: "Contact",
    label: "Contact",
    path: "/shop/contact",
  },

  {
    id: "Search",
    label: "Search",
    path: "/shop/search",
  },
  
  
];

export const categoryOptionsMap = {
  'casualwears': "Casual Wears",
  'partywears': 'Party Wears',
  'weddingwears': 'Wedding Wears'
}


export const brandOptionsMap = {
  'sabyasachi': "Sabyasachi",
  'biba': 'Biba',
  'manishMalhotra': 'Manish Malhotra'
}

export const filterOptions = {
  brand: [
    { id: "sabyasachi", label: "Sabyasachi" },
    { id: "biba", label: "Biba" },
    { id: "manishMalhotra", label: "Manish Malhotra" },
  ],
  category: [
    { id: "casualwears", label: "Casual Wears" },
    { id: "partywears", label: "Party Wears" },
    { id: "weddingwears", label: "Wedding Wears" },
  ],
};

export const adPlacementOptions = [
  { id: "home-strip", label: "Home page strip" },
  { id: "listing-top", label: "Top of listing page" },
];

export const adFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Internal title, e.g. Festive brand campaign",
  },
  {
    label: "Placement",
    name: "placement",
    componentType: "select",
    options: [
      { id: "home-strip", label: "Home page strip" },
      { id: "listing-top", label: "Top of listing page" },
    ],
  },
  {
    label: "Link URL",
    name: "linkUrl",
    componentType: "input",
    type: "url",
    placeholder: "Where the banner sends shoppers, e.g. https://brand.com",
  },
  {
    label: "Active",
    name: "isActive",
    componentType: "checkbox",
    description: "Only active ads inside their date window are shown",
  },
  {
    label: "Start Date",
    name: "startsAt",
    componentType: "input",
    type: "date",
    placeholder: "Optional start date",
  },
  {
    label: "End Date",
    name: "endsAt",
    componentType: "input",
    type: "date",
    placeholder: "Optional end date",
  },
];
export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
]

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];