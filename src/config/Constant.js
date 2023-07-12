import { salaryNumberFormate } from '../components/common'
// Date constant
export const DATE_FORMATE = {
    FORMATE1: 'MMM DD, YYYY HH:mm A',
    FORMATE2: 'MM-DD-YYYY',
    FORMATE3: 'MM/DD/YYYY',
    FORMATE4: 'YYYY-MM-DD',
    FORMATE5: 'DD-MM-YYYY',
    FORMATE6: 'MMM DD, YYYY',
    FORMATE7: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
}

// Date constant
export const DASHBOARD_KEYS = {
    DASH_BOARD: 1,
    MYADS: 2,
    DAILY_DEALS: 3,
    MESSAGES: 4,
    REVIEWS: 5,
    PAYMENTS:6,
    JOB_APPLICATION:7,
    MANAGE_CLASSES: 8,
    DAILY_DEALS: 9,
    PROMOTIONS: 10,
    BEST_PACKAGES: 11,
    SPECIAL_OFFER: 12,
    SPA_CALENDER: 13,
    BEAUTY_CALENDER: 14,
    FITNESS: 15,
    RESTAURANT:16,
    CART:17,
    BOOKINGS:18,
    ORDERS:19,
    INSPECTION: 20,
    BEAUTY_SERVICES:21,
    RETAIL_ORDERS:22,
    RETAIL_TRANSACTION: 23,
    SPA_SERVICES:24,
    RESTAURANT_ORDERS:25,
    RESTAURANT_MENUES:26,
    MY_OFFERS:27,
    PAYMENTS_METHODS:28,
    MY_PROFILE:29
}

//footer slugs
export const FOOTER_SLUGS = {
    ABOUT_US: 'about-us',
    SAFETY_TIPS:'safety-tips',
    CONTACT_US:'contact-us',
    TERMS_OF_USE:'terms-of-use',
    PRIVACY_POLICY:	'privacy-policy',
    TC_LEGAL_NOTICES:'tc-legal-notices',
    SERVICES:'services',
    POSTING_POLICY:'posting-policy',
    PARTNERSHIPS:'partnerships',
    CAREERS:'careers',
    JOIN_FORMEE:'join-formee',
    HOW_IT_WORKS :'how-it-works'
}

let temp  = [{ label: '50', value: 50 },{ label: '1000', value: 1000 }, { label: '2000', value: 2000 }, { label: '3000', value: 3000 }, { label: '4000', value: 4000 }, { label: '5000', value: 5000 }, { label: '6000', value: 6000 }, { label: '7000', value: 7000 }, { label: '8000', value: 8000 }, { label: '9000', value: 9000 }, { label: '10,000', value: 10000 }, { label: '15,000', value: 15000 }, { label: '20000', value: 20000 }, { label: '40000', value: 40000 }, { label: '60,000', value: 60000 }, { label: '80000', value: 80000 }, { label: '100000', value: 1000000 }, { label: '200000', value: 2000000 }, { label: '300000', value: 3000000 }, { label: '400000', value: 4000000 }, { label: '500000', value: 5000000 }]
let temp2 = []
for(let i = 50; i<= 5000; i = i +25){
    temp2.push({label:`$${salaryNumberFormate(i)}`, value: i })
}
// temp.map(el => {
//     temp2.push({label:salaryNumberFormate(el.label), value: el.value })
// })

export const PRIZE_OPTIONS = temp2
export const PRIZE_OPTIONS_Classified  =  [{ label: 'Any', value: 0 },...temp2]

let booking_price_list = [{ label: '10', value: 10 },{ label: '50', value: 50 },{ label: '100', value: 100 },{ label: '500', value: 500 },{ label: '1000', value: 1000 }, { label: '2000', value: 2000 }, { label: '3000', value: 3000 }, { label: '4000', value: 4000 }, { label: '5000', value: 5000 }, { label: '6000', value: 6000 }, { label: '7000', value: 7000 }, { label: '8000', value: 8000 }, { label: '9000', value: 9000 }, { label: '10,000', value: 10000 }, { label: '15,000', value: 15000 }, { label: '20000', value: 20000 }, { label: '40000', value: 40000 }, { label: '60,000', value: 60000 }, { label: '80000', value: 80000 }, { label: '100000', value: 1000000 }, { label: '200000', value: 2000000 }, { label: '300000', value: 3000000 }, { label: '400000', value: 4000000 }, { label: '500000', value: 5000000 }]
let temparray = []
booking_price_list.map(el => {
    temparray.push({label:salaryNumberFormate(el.label), value: el.value })
})

export const BOOKING_PRIZE_OPTIONS = temparray
// export const PRIZE_OPTIONS = [{ label: '1000', value: 1000 }, { label: '2000', value: 2000 }, { label: '3000', value: 3000 }, { label: '4000', value: 4000 }, { label: '5000', value: 5000 }, { label: '6000', value: 6000 }, { label: '7000', value: 7000 }, { label: '8000', value: 8000 }, { label: '9000', value: 9000 }, { label: '10,000', value: 10000 }, { label: '15,000', value: 15000 }, { label: '20,000', value: 20000 }, { label: '40,000', value: 40000 }, { label: '60,000', value: 60000 }, { label: '80,000', value: 80000 }, { label: '1,00,000', value: 1000000 }, { label: '2,00,000', value: 2000000 }, { label: '3,00,000', value: 3000000 }, { label: '4,00,000', value: 4000000 }, { label: '5,00,000', value: 5000000 }]

export const DISTANCE_OPTION = [
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200
]

export const OCCUPATION_TYPE = [
    { name: 'Classified', value: 'classified' },
    { name: 'Retail', value: 'retail' },
    { name: 'Booking', value: 'booking' },
]



export const SALARY_OPTIONS_MIN = [{ label: '$0', value: 0 }, { label: '$15', value: 15 }, { label: '$20', value: 20 }, { label: '$25', value: 25 }, { label: '$30', value: 30 }, { label: '$35', value: 35 }, { label: '$40', value: 40 }, { label: '$50', value: 50 }, { label: '$60', value: 60 }, { label: '$75', value: 75 }, { label: '$100', value: 100 }]

export const SALARY_OPTIONS_MAX = [{ label: '$15', value: 15 }, { label: '$20', value: 20 }, { label: '$25', value: 25 }, { label: '$30', value: 30 }, { label: '$35', value: 35 }, { label: '$40', value: 40 }, { label: '$50', value: 50 }, { label: '$60', value: 60 }, { label: '$75', value: 75 }, { label: '$100', value: 100 }, { label: '$150+', value: 150 }]


//automative category price
export const AUTOMATIVE_PRICE = [{ value: 0, label: 'Any' },{ value: 3000, label: '$3,000' }, { value: 5000, label: '$5,000' }, { value: 7500, label: '$7,500' }, { value: 10000, label: '$10,000' }, { value: 15000, label: '$15,000' }, { value: 20000, label: '$20,000' }, { value: 25000, label: '$25,000' }, { value: 30000, label: '$30,000' },{ value: 350000, label: '$35,000' }, { value: 40000, label: '$40,000' }, { value: 45000, label: '$45,000' }, { value: 50000, label: '$50,000' }, { value: 60000, label: '$60,000' }, { value: 70000, label: '$70,000' }, { value: 80000, label: '$80,000' },{ value: 90000, label: '$90,000' },{ value: 100000, label: '$100,000' },{ value: 150000, label: '$150,000' }]

//carvans and campers category price
export const CARSVANS_PRICE = [{ value: 0, label: 'Any' }, { value: 10000, label: '$10,000' }, { value: 20000, label: '$20,000' },{ value: 30000, label: '$30,000' }, { value: 40000, label: '$40,000' }, { value: 50000, label: '$50,000' }, { value: 60000, label: '$60,000' }, { value: 70000, label: '$70,000' }, { value: 80000, label: '$80,000' },{ value: 90000, label: '$90,000' },{ value: 100000, label: '$100,000' },{ value: 125000, label: '$125,000' },{ value: 150000, label: '$150,000' }, { value: 175000, label: '$175,000'},{ value: 200000, label: '$200,000' },{ value: 225000, label: '$225,000'},{ value: 250000, label: '$250,000'},{ value: 275000, label: '$275,000'},{ value: 300000, label: '$300,000'}, { value: 400000, label: '$400,000'},{ value: 500000, label: '$500,000'},{ value: 1000000, label: '$1,000,000'},{ value: 2000000, label: '$2,000,000'},{ value: 3000000, label: '$3,000,000'}]

//motorcycle category price
export const MOTORCYCLE_PRICE = [{ value: 0, label: 'Any' },{ value: 250, label: '$250' }, { value: 500, label: '$500' }, { value: 1000, label: '$1,000' }, { value: 1500, label: '$1,500' }, { value: 2000, label: '$2,000' }, { value: 2500, label: '$2,500' }, { value: 3000, label: '$3,000' }, { value: 3500, label: '$3,500' }, { value: 4000, label: '$4,000' },{ value: 4500, label: '$4,500' }, { value: 5000, label: '$5,000' }, { value: 7500, label: '$7,500' }, { value: 10000, label: '$10,000' }, { value: 12500, label: '$12,500' }, { value: 15000, label: '$15,000' }, { value: 17500, label: '$17,500' },{ value: 20000, label: '$20,000' },{ value: 25000, label: '$25,000' },{ value: 30000, label: '$30,000' },{ value: 35000, label: '$35,000' },{ value: 40000, label: '$40,000' },{ value: 45000, label: '$45,000' },{ value: 50000, label: '$50,000' }]

// job  price annually
export const SALARY_ANUALLY = [{ label: '$0', value: 0 },{ label: '$30K', value: 30 }, { label: '$35K', value: 35 }, { label: '$40K', value: 40 }, { label: '$50K', value: 50 }, { label: '$60K', value: 60 }, { label: '$100K', value: 100 },{ label: '$150K', value: 150 }, { label: '$200K', value: 200 }, { label: '$250K', value: 250 }, { label: '$300K', value: 300 }]

// job  price hourly
export const SALARY_HOURLY = [{ label: '$0', value: 0 }, { label: '$15', value: 15 }, { label: '$20', value: 20 }, { label: '$25', value: 25 }, { label: '$30', value: 30 }, { label: '$35', value: 35 }, { label: '$40', value: 40 }, { label: '$50', value: 50 }, { label: '$60', value: 60 }, { label: '$70', value: 70 }, { label: '$100', value: 100 }]

// residential category price
export const RESIDENCIAL_RENT = [{ value: 50000, label: '$50pw' }, { value: 75000, label: '$75pw' },{ value: 100000, label: '$100pw' }, { value: 1250000, label: '$125pw' }, { value: 150000, label: '$150pw' }, { value: 1750000, label: '$175pw' }, { value: 200000, label: '$200pw' }, { value: 225000, label: '$225pw' },{ value: 250000, label: '$250pw' },{ value: 275000, label: '$275pw' },{ value: 300000, label: '$300pw' },{ value: 325000, label: '$325pw' }, { value: 350000, label: '$350pw'},{ value: 375000, label: '$375pw' },{ value: 400000, label: '$400pw'},{ value: 425000, label: '$425pw'},{ value: 450000, label: '$450pw'},{ value: 475000, label: '$475pw'}, { value: 500000, label: '$500pw'},{ value: 550000, label: '$550pw'},{ value: 600000, label: '$600pw'},{ value: 650000, label: '$650pw'},{ value: 700000, label: '$700pw'}, { value: 850000, label: '$850pw'},{ value: 900000, label: '$900pw'},{ value: 950000, label: '$950pw'},{ value: 1000000, label: '$1,000pw'},{ value: 1100000, label: '$1,100pw'},{ value: 1200000, label: '$1,200pw'},{ value: 1300000, label: '$1,300pw'},{ value: 1400000, label: '$1,400pw'},{ value: 1500000, label: '$1,500pw'},{ value: 1600000, label: '$1,600pw'},{ value: 1700000, label: '$1,700pw'},{ value: 1800000, label: '$1,800pw'},{ value: 1900000, label: '$1,900pw'},{ value: 2000000, label: '$2,000pw'},{ value: 2500000, label: '$2,500pw'},{ value: 3000000, label: '$3,000pw'}, { value: 3500000, label: '$3,500pw'},{ value: 4000000, label: '$4,000pw'},{ value: 4500000, label: '$4,500pw'},{ value: 5000000, label: '$5,000pw'}]

// residential category price
export const RESIDENCIAL_BUY_SOLD = [{ value: 50000, label: '$50,000' }, { value: 75000, label: '$75,000' },{ value: 100000, label: '$100,000' }, { value: 1250000, label: '$125,000' }, { value: 150000, label: '$150,000' }, { value: 1750000, label: '$175,000' }, { value: 200000, label: '$200,000' }, { value: 225000, label: '$225,000' },{ value: 250000, label: '$250,000' },{ value: 275000, label: '$275,000' },{ value: 300000, label: '$300,000' },{ value: 325000, label: '$325,000' }, { value: 350000, label: '$350,000'},{ value: 375000, label: '$375,000' },{ value: 400000, label: '$400,000'},{ value: 425000, label: '$425,000'},{ value: 450000, label: '$450,000'},{ value: 475000, label: '$475,000'}, { value: 500000, label: '$500,000'},{ value: 550000, label: '$550,000'},{ value: 600000, label: '$600,000'},{ value: 650000, label: '$650,000'},{ value: 700000, label: '$700,000'}, { value: 850000, label: '$850,000'},{ value: 900000, label: '$900,000'},{ value: 950000, label: '$950,000'}, { value: 850000, label: '$850,000'}, { value: 850000, label: '$850,000'}, { value: 850000, label: '$850,000'}, { value: 1000000, label: '$1,000,000'},{ value: 1000000, label: '$1,000,000'},{ value: 1200000, label: '$1,200,000'},{ value: 1300000, label: '$1,300,000'},{ value: 1400000, label: '$1,400,000'},{ value: 1500000, label: '$1,500,000'},{ value: 1600000, label: '$1,600,000'},{ value: 1700000, label: '$1,700,000'},{ value: 1800000, label: '$1,800,000'},{ value: 1900000, label: '$1,900,000'},{ value: 2000000, label: '$2,000,000'},{ value: 2500000, label: '$2,500,000'},{ value: 3000000, label: '$3,000,000'}, { value: 3500000, label: '$3,500,000'},{ value: 4000000, label: '$4,000,000'},{ value: 4500000, label: '$4,500,000'},{ value: 5000000, label: '$5,000,000'},{ value: 6000000, label: '$6,000,000'}, { value: 7000000, label: '$7,000,000'},{ value: 8000000, label: '$8,000,000'},{ value: 9000000, label: '$9,000,000'}, { value: 10000000, label: '$10,000,000'},{ value: 11000000, label: '$11,000,000'},{ value: 12000000, label: '$12,000,000'},{ value: 15000000, label: '$15,000,000'}]

// commertial category price
export const COMMERTIAL_PRICE = [{ value: 50000, label: '$5,000 p.a' }, { value: 10000, label: '$10,000 p.a' },{ value: 20000, label: '$20,000 p.a' },{ value: 25000, label: '$25,000 p.a' },{ value: 30000, label: '$30,000 p.a' },{ value: 35000, label: '$35,000 p.a' },{ value: 40000, label: '$40,000 p.a' },{ value: 45000, label: '$45,000 p.a' },{ value: 50000, label: '$50,000 p.a' },{ value: 60000, label: '$60,000 p.a' },{ value: 70000, label: '$70,000 p.a' },{ value: 80000, label: '$80,000 p.a' },{ value: 90000, label: '$90,000 p.a' },{ value: 100000, label: '$100,000 p.a' },{ value: 150000, label: '$150,000 p.a' },{ value: 150000, label: '$150,000 p.a' }, { value: 200000, label: '$200,000 p.a' },{ value: 250000, label: '$250,000 p.a' }, { value: 500000, label: '$500,000 p.a' }, { value: 1000000, label: '$1,000,000 p.a' },{ value: 2000000, label: '$2,000,000 p.a' },]

// commertial buy/sold price category price
export const COMMERTIAL_BUY_SOLD= [{ value: 100000, label: '$100,000' }, { value: 1250000, label: '$125,000' }, { value: 150000, label: '$150,000' }, { value: 1750000, label: '$175,000' }, { value: 200000, label: '$200,000' }, { value: 225000, label: '$225,000' },{ value: 250000, label: '$250,000' },{ value: 275000, label: '$275,000' },{ value: 300000, label: '$300,000' },{ value: 325000, label: '$325,000' }, { value: 350000, label: '$350,000'},{ value: 375000, label: '$375,000' },{ value: 400000, label: '$400,000'},{ value: 425000, label: '$425,000'},{ value: 450000, label: '$450,000'},{ value: 475000, label: '$475,000'}, { value: 500000, label: '$500,000'},{ value: 550000, label: '$550,000'},{ value: 600000, label: '$600,000'},{ value: 650000, label: '$650,000'},{ value: 700000, label: '$700,000'}, { value: 850000, label: '$850,000'},{ value: 900000, label: '$900,000'},{ value: 950000, label: '$950,000'}, { value: 850000, label: '$850,000'}, { value: 850000, label: '$850,000'}, { value: 850000, label: '$850,000'}, { value: 1000000, label: '$1,000,000'},{ value: 1000000, label: '$1,000,000'},{ value: 1200000, label: '$1,200,000'},{ value: 1300000, label: '$1,300,000'},{ value: 1400000, label: '$1,400,000'},{ value: 1500000, label: '$1,500,000'},{ value: 1600000, label: '$1,600,000'},{ value: 1700000, label: '$1,700,000'},{ value: 1800000, label: '$1,800,000'},{ value: 1900000, label: '$1,900,000'},{ value: 2000000, label: '$2,000,000'},{ value: 2500000, label: '$2,500,000'},{ value: 3000000, label: '$3,000,000'}, { value: 3500000, label: '$3,500,000'},{ value: 4000000, label: '$4,000,000'},{ value: 4500000, label: '$4,500,000'},{ value: 5000000, label: '$5,000,000'},{ value: 6000000, label: '$6,000,000'}, { value: 7000000, label: '$7,000,000'},{ value: 8000000, label: '$8,000,000'},{ value: 9000000, label: '$9,000,000'}, { value: 10000000, label: '$10,000,000'},{ value: 11000000, label: '$11,000,000'},{ value: 12000000, label: '$12,000,000'},{ value: 15000000, label: '$15,000,000'}]

export const getPriceOption = (cat_type, sub_cat_type) => {
    if(sub_cat_type === 'Cars & Vans'){
        return AUTOMATIVE_PRICE
    }else if(sub_cat_type === 'Caravan & Campers'){
        return CARSVANS_PRICE
    }else if(sub_cat_type === 'Motorcycle'){
        return MOTORCYCLE_PRICE
    }else if(sub_cat_type === 'Commercial Real Estate'){
        return COMMERTIAL_PRICE
    }else if(sub_cat_type === 'Residential Real Estate'){
        return RESIDENCIAL_RENT
    }else {
        return PRIZE_OPTIONS_Classified
    }
}

export const NATIONALITY = ['Afghan',
'Albanian',
'Algerian',
'American',
'Andorran',
'Angolan',
'Antiguans',
'Argentinean',
'Armenian',
'Australian',
'Austrian',
'Azerbaijani',
'Bahamian',
'Bahraini',
'Bangladeshi',
'Barbadian',
'Barbudans',
'Batswana',
'Belarusian',
'Belgian',
'Belizean',
'Beninese',
'Bhutanese',
'Bolivian',
'Bosnian',
'Brazilian',
'British',
'Bruneian',
'Bulgarian',
'Burkinabe',
'Burmese',
'Burundian',
'Cambodian',
'Cameroonian',
'Canadian',
'Cape Verdean',
'Central African',
'Chadian',
'Chilean',
'Chinese',
'Colombian',
'Comoran',
'Congolese',
'Costa Rican',
'Croatian',
'Cuban',
'Cypriot',
'Czech',
'Danish',
'Djibouti',
'Dominican',
'Dutch',
'East Timorese',
'Ecuadorean',
'Egyptian',
'Emirian',
'Equatorial Guinean',
'Eritrean',
'Estonian',
'Ethiopian',
'Fijian',
'Filipino',
'Finnish',
'French',
'Gabonese',
'Gambian',
'Georgian',
'German',
'Ghanaian',
'Greek',
'Grenadian',
'Guatemalan',
'Guinea-Bissauan',
'Guinean',
'Guyanese',
'Haitian',
'Herzegovinian',
'Honduran',
'Hungarian',
'I-Kiribati',
'Icelander',
'Indian',
'Indonesian',
'Iranian',
'Iraqi',
'Irish',
'Israeli',
'Italian',
'Ivorian',
'Jamaican',
'Japanese',
'Jordanian',
'Kazakhstani',
'Kenyan',
'Kittian and Nevisian',
'Kuwaiti',
'Kyrgyz',
'Laotian',
'Latvian',
'Lebanese',
'Liberian',
'Libyan',
'Liechtensteiner',
'Lithuanian',
'Luxembourger',
'Macedonian',
'Malagasy',
'Malawian',
'Malaysian',
'Maldivan',
'Malian',
'Maltese',
'Marshallese',
'Mauritanian',
'Mauritian',
'Mexican',
'Micronesian',
'Moldovan',
'Monacan',
'Mongolian',
'Moroccan',
'Mosotho',
'Motswana',
'Mozambican',
'Namibian',
'Nauruan',
'Nepalese',
'New Zealander',
'Nicaraguan',
'Nigerian',
'Nigerien',
'North Korean',
'Northern Irish',
'Norwegian',
'Omani',
'Pakistani',
'Palauan',
'Panamanian',
'Papua New Guinean',
'Paraguayan',
'Peruvian',
'Polish',
'Portuguese',
'Qatari',
'Romanian',
'Russian',
'Rwandan',
'Saint Lucian',
'Salvadoran',
'Samoan',
'San Marinese',
'Sao Tomean',
'Saudi',
'Scottish',
'Senegalese',
'Serbian',
'Seychellois',
'Sierra Leonean',
'Singaporean',
'Slovakian',
'Slovenian',
'Solomon Islander',
'Somali',
'South African',
'South Korean',
'Spanish',
'Sri Lankan',
'Sudanese',
'Surinamer',
'Swazi',
'Swedish',
'Swiss',
'Syrian',
'Taiwanese',
'Tajik',
'Tanzanian',
'Thai',
'Togolese',
'Tongan',
'Trinidadian/Tobagonian',
'Tunisian',
'Turkish',
'Tuvaluan',
'Ugandan',
'Ukrainian',
'Uruguayan',
'Uzbekistani',
'Venezuelan',
'Vietnamese',
'Welsh',
'Yemenite',
'Zambian',
'Zimbabwean']


let hours = [], minutes=[]
for(let i = 0; i<= 24; i++){
    let a = i < 10 ? `0${i}` : i
    hours.push(a)
}
// for(let i = 0; i<= 60; i++){
//     let a = i < 10 ? `0${i}` : i
//     minutes.push(a)
// }
export const HOURS = hours
export const MINUTES = ['00', '15', '30', '43']

export const TIME_DURATION = [
    {value: '00:00', key:'00:00   AM'},{value: '00:30', key:'00:30   AM'},
    {value: '01:00', key:'01:00   AM'},{value: '01:30', key:'01:30   AM'},
    {value: '02:00', key:'02:00   AM'},{value: '02:30', key:'02:30   AM'},
    {value: '03:00', key:'03:00   AM'},{value: '03:30', key:'03:30   AM'},
    {value: '04:00', key:'04:00   AM'},{value: '04:30', key:'04:30   AM'},
    {value: '05:00', key:'05:00   AM'},{value: '05:30', key:'05:30   AM'},
    {value: '06:00', key:'06:00   AM'},{value: '06:30', key:'06:30   AM'},
    {value: '07:00', key:'07:00   AM'},{value: '07:30', key:'07:30   AM'},
    {value: '08:00', key:'08:00   AM'},{value: '08:30', key:'08:30   AM'},
    {value: '09:00', key:'09:00   AM'},{value: '09:30', key:'09:30   AM'},
    {value: '10:00', key:'10:00   AM'},{value: '10:30', key:'10:30   AM'},
    {value: '11:00', key:'11:00   AM'},{value: '11:30', key:'11:30   AM'},

    {value: '12:00', key:'12:00   PM'},{value: '12:30', key:'12:30   PM'},
    {value: '13:00', key:'01:00   PM'},{value: '13:30', key:'01:30   PM'},
    {value: '14:00', key:'02:00   PM'},{value: '14:30', key:'02:30   PM'},
    {value: '15:00', key:'03:00   PM'},{value: '15:30', key:'03:30   PM'},
    {value: '16:00', key:'04:00   PM'},{value: '16:30', key:'04:30   PM'},
    {value: '17:00', key:'05:00   PM'},{value: '17:30', key:'05:30   PM'},
    {value: '18:00', key:'06:00   PM'},{value: '18:30', key:'06:30   PM'},
    {value: '19:00', key:'07:00   PM'},{value: '19:30', key:'07:30   PM'},
    {value: '20:00', key:'08:00   PM'},{value: '20:30', key:'08:30   PM'},
    {value: '21:00', key:'09:00   PM'},{value: '21:30', key:'09:30   PM'},
    {value: '22:00', key:'10:00   PM'},{value: '22:30', key:'10:30   PM'},
    {value: '23:00', key:'11:00   PM'},{value: '23:30', key:'11:30   PM'}
]



