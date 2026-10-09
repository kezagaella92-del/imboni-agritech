import surveyData from './generatedSurveyData.json'

const districtProvinces = {
  Kigali: ['Nyarugenge', 'Gasabo', 'Kicukiro'],
  Southern: [
    'Nyanza', 'Gisagara', 'Nyaruguru', 'Huye', 'Nyamagabe', 'Ruhango',
    'Muhanga', 'Kamonyi',
  ],
  Western: [
    'Karongi', 'Rutsiro', 'Rubavu', 'Nyabihu', 'Ngororero', 'Rusizi',
    'Nyamasheke',
  ],
  Northern: ['Rulindo', 'Gakenke', 'Musanze', 'Burera', 'Gicumbi'],
  Eastern: [
    'Rwamagana', 'Nyagatare', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma',
    'Bugesera',
  ],
}

const provinceByDistrict = Object.fromEntries(
  Object.entries(districtProvinces).flatMap(([province, names]) =>
    names.map((name) => [name, province]),
  ),
)

export const districts = surveyData.districts.map((district) => {
  const province = provinceByDistrict[district.name]
  if (!province) {
    throw new Error(`No province is configured for survey district "${district.name}"`)
  }
  return { ...district, province }
})

export const provinces = Object.keys(districtProvinces)

export const provinceColors = {
  Kigali: 'bg-purple-100 text-purple-800',
  Southern: 'bg-green-100 text-green-800',
  Western: 'bg-blue-100 text-blue-800',
  Northern: 'bg-yellow-100 text-yellow-800',
  Eastern: 'bg-orange-100 text-orange-800',
}
