let sports = [];
let conferences = [];
let schools = [];
let selectedSchool = null;
let filterContainer;
console.log(filterContainer);

window.onload = async function() {
    const response = await fetch("/.netlify/functions/get-schools");
    const data = await response.json();
    schools = data.schools;   
    console.log(schools);

    showAllSchools();
}

async function showAllSchools() {
    const schoolContainer = document.getElementById("schools-container");

    schools.forEach(school => {
        console.log("Current School:", school.school);
        const schoolBox = createSchoolBox(school, sections = ["school", "acronym", "nickname", "conference", "location"]);

        schoolContainer.appendChild(schoolBox);
    });
}

function createSchoolBox(school, sections = []) {
    let schoolLogo = "/images/schools/${school.school}.webp";
    if(school.use_logo_2){
        scoolLogo = "/images/schools/${school.school}2.webp"
    }  
    const schoolBox = document.createElement("div");
    schoolBox.className = "school-box";
    schoolBox.style.background = school.color_1;

    const schoolLogoContainer = document.createElement("div");
    schoolLogoContainer.className = "school-logo-container";
    schoolLogoContainer.innerHTML = `<img class = "school-logo" src = ${schoolLogo}>`;
    schoolBox.appendChild(schoolLogoContainer);

    let divider = document.createElement("div");
    divider.className = "school-box-divider";
    schoolBox.appendChild(divider);

    for(const section of sections){
        const schoolBoxSection = document.createElement("div");
        schoolBoxSection.className = "school-box-section";
        schoolBoxSection.innerHTML = school[section];
        schoolBox.appendChild(schoolBoxSection);
        let divider = document.createElement("div");
        divider.className = "school-box-divider";
        schoolBox.appendChild(divider);
    }

    return schoolBox;
}


