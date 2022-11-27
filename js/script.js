
const getJobsWithAsyncAwait = async () => {
    const response = await fetch("https://6381400d9440b61b0d14b99a.mockapi.io/jobs")
    const jobs = await response.json()
    return jobs
}

getJobsWithAsyncAwait().then(data=>jobsCards(data))



const $ = (selector)=> document.querySelector(selector)
const $$ = (selector)=> document.querySelectorAll(selector)


const jobsCards = (arrayJobs) => {
    console.log(arrayJobs)
    for(const {name,description,location,category,seniority, img} of arrayJobs){
        
    
       $("#container").innerHTML += `
       <div id = "card-{id}" class="w-5/6 h-full my-3 border border-2 rounded-md shadow-2xl">
       <figure class ="w-full h-1/3 flex mt-2 justify-center items-center">
           <img src=${img}" alt="job" class=>
       </figure>
       <div id ="contents" class="h-2/3 p-2 flex flex-col justify-center items-center">
           <h3 class="text-xl font-bold underline">${name}</h3>
           <p class="my-4 p-2 text-justify">${description}</p>
           <div class="flex flex-row">
               <div id="locationDiv" class="m-1 bg-pink-400 text-center font-bold ">${location}</div>
               <div id="categoryDiv" class="m-1 bg-yellow-400 text-center font-bold">${category}</div>
               <div id="seniorityDiv" class="m-1 bg-orange-400 text-center font-bold">${seniority}</div>
           </div>
           <button class="w-2/3 h-10 my-2 rounded-md shadow-md bg-blue-400 text-white font-bold">See Details</button>
       </div>
   </div>
    `
    }
}



