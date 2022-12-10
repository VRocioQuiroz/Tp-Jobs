const $ = (selector)=> document.querySelector(selector)
const $$ = (selector)=> document.querySelectorAll(selector)

const hideElement = (selector) => selector.classList.add("hidden")
const showElement = (selector) => selector.classList.remove("hidden")


//TRAER TRABAJOS

const getJobs = async () => {
    const response = await fetch("https://6381400d9440b61b0d14b99a.mockapi.io/jobs")
    const jobs = await response.json() 
    return jobs    
}

getJobs().then(data => jobsCards(data))
getJobs().catch(() => failedToLoad())


//TRAER UN TRABAJO

const getAJob = async (id) => {
    const response = await fetch(`https://6381400d9440b61b0d14b99a.mockapi.io/jobs/${id}`)
    const job = await response.json()
    return job
}


//GENERAR TARJETAS

const jobsCards = (arrayJobs) => {
   
 $("#container").innerHTML = ""
   
 if(arrayJobs){

    hideElement($("#spinner"))

    for(const {id, name,description,location,category,seniority,img} of arrayJobs){
        
       $("#container").innerHTML += `
        <div id ="card-${id}" class="w-[96%] h-[700px] my-3 border border-2 rounded-md shadow-2xl sm:px-1 sm:w-1/2 md:mx-4 md:w-2/5 lg:w-1/3 xl:mx-2 xl:w-1/5 xl:h-[760px]">
            <figure class ="w-full flex mt-2 justify-center items-center">
              <img src="${img}" alt="job" class="w-full h-[170px]">
            </figure>
            <div id ="contents" class="h-2/3 mt-2 p-2 flex flex-col justify-center items-center">
                <h3 class="mb-2 sm:m-0 text-2xl text-center font-bold xl:mt-2">${name}</h3>
                <p class="mt-4 p-2 text-xl text-center sm:text-lg xl:text-xl">${description}</p>
            
                <div class="flex flex-row my-3 h-20">
                   <div id="locationDiv" class="m-1 px-2 flex items-center bg-pink-400 text-sm text-center font-bold rounded-md hover:bg-pink-600">${location}</div>
                   <div id="categoryDiv" class="m-1 px-2 flex items-center bg-yellow-400 text-sm text-center font-bold rounded-md hover:bg-yellow-600">${category}</div>
                   <div id="seniorityDiv" class="m-1 px-2 flex items-center bg-orange-400 text-sm text-center font-bold rounded-md hover:bg-orange-600">${seniority}</div>
                </div>
                <button class="w-2/3 h-14 mt-2 sm:h-10 rounded-md shadow-md bg-indigo-700 text-xl text-white font-bold hover:bg-indigo-500 duration-500 active:scale-50 btnDetailJob" data-id="${id}">Ver detalles</button>
            </div>
        </div>
        `
    }

    for (const btn of $$(".btnDetailJob")) {
        btn.addEventListener("click", () => {
            showElement($("#spinner"))

            const jobId = btn.getAttribute("data-id")

            getAJob(jobId).then(data => viewJobDetail(data))

            hideElement($("#filters"))
                
        })
    }
 }
}

//VER DETALLE DE UN TRABAJO

const viewJobDetail = (job) => {

    hideElement($("#spinner"))

    const {name, description, location, category, seniority, img, detail, id} = job

    $("#container").innerHTML = `
    
    <div id="card-${id}" class="w-[96%] h-full my-4 border border-2 rounded-md shadow-2xl sm:w-1/2 xl:2/3 xl:py-4">
       <figure class ="w-full h-1/3 flex mt-2 justify-center items-center">
            <img src="${img}" alt="job" class="w-full h-[170px]">
       </figure>
       <div id ="contents" class="h-2/3 p-2 flex flex-col justify-center items-center">
            <h3 class="text-3xl font-bold text-center">${name}</h3>
            <p class="mt-4 px-2 text-2xl text-center">${description}</p>
            <a id="seeMore" class="showDetail my-4 text-xl  text-blue-600 text-center underline block">Ver más detalles</a>
            <a id="seeLess" class="showDetail my-4 text-xl text-blue-600 text-center underline block hidden">Ocultar detalles</a>
            <p id="seeDetail" class="mb-4 px-2 text-2xl text-center hidden">${detail}</p>
            
            <div class="flex flex-row">
               <div id="locationDiv" class="h-14 my-2 mx-1 px-2 flex items-center bg-pink-400 text-xl text-center font-bold rounded-md">${location}</div>
               <div id="categoryDiv" class="h-14 my-2 mx-1 px-2 flex items-center bg-yellow-400 text-xl text-center font-bold rounded-md ">${category}</div>
               <div id="seniorityDiv" class="h-14 my-2 mx-1 px-2 flex items-center bg-orange-400 text-xl text-center font-bold rounded-md">${seniority}</div>
            </div>
          
        </div>

        <div class="flex w-full justify-center">
            <button data-id="${id}" class="btnEditJob w-1/3 h-14 m-2 rounded-md shadow-md bg-green-400 text-xl text-white font-bold" >Edit</button>
            <button data-id="${id}" class="btnDeleteJob w-1/3 h-14 m-2 rounded-md shadow-md bg-red-400 text-xl text-white font-bold" >Delete</button>  
        </div>
    </div>
    `

  for (const btn of $$(".btnDeleteJob")) {
    btn.addEventListener("click", () => {
        showElement($("#confirm"))
        $("#container").innerHTML = ""

        const jobId = btn.getAttribute("data-id")
        alertConfirm(jobId)
    
    })
  }
   
  for (const btn of $$(".btnEditJob")) {
    btn.addEventListener("click", () => {
        showElement($("#editJobForm"))
        $("#container").innerHTML = ""

        preloadJob(job)

        const jobId = btn.getAttribute("data-id")
        $("#submitEdited").setAttribute("data-id", jobId)

    })
  }
   
  //Ver más detalles
  
  for (const btn of $$(".showDetail")) {
    btn.addEventListener("click", () => {
        
        $("#seeLess").classList.toggle('hidden')
        $("#seeMore").classList.toggle('hidden')
        $("#seeDetail").classList.toggle('hidden')
               
    })
  }
}

//FUNCION CATCH

const failedToLoad = () => {
    $("#error").innerHTML = `
    <div class="w-4/5 h-16 border-red-500 bg-red-200 flex justify-center items-center md:w-3/5">
       <p class="text-2xl text-red-500 mr-3">Error al cargar la página</p>   
    </div>`

    hideElement($("#chooseFilter"))
    hideElement($("#spinner"))
}


//ALERTA DE CONFIRMACION

const alertConfirm = (id) => {
    getAJob(id).then(data => $("#confirm").innerHTML = `
    <div class="w-4/5 h-20 px-2 py-6 lg:h-24 border-red-500 bg-red-200 flex justify-center items-center md:w-5/6">
       <p class="text-red-500 mr-3 lg:text-2xl">¿Estás seguro de eliminar ${data.name}?</p>
       <button id="${data.id}" class="w-1/3 h-10 m-1 lg:w-1/5 lg:h-14 lg:text-lg rounded-md shadow-md bg-red-400 text-white font-bold  text-xs md:w-1/12" onclick="deleteJob(${data.id})">Eliminar trabajo</button>
       <button class="w-1/3 h-10 lg:h-14 m-1 lg:w-1/5 lg:text-lg  rounded-md shadow-md bg-green-400 text-white font-bold text-xs md:w-1/12" onclick="cancelDeleteJob()">Cancelar</button>
    </div>`)
      
}

//CANCELAR ELIMINACION DE TRABAJO

const cancelDeleteJob = () => {
    hideElement($("#confirm"))

    getJobs().then(data => jobsCards(data))
}


//ELIMINAR TRABAJO

const deleteJob = (id) => {
    fetch(`https://6381400d9440b61b0d14b99a.mockapi.io/jobs/${id}`, {
        method: "DELETE"
    }).finally(() => window.location.href = "index.html")
}


//EDITAR TRABAJO

//Precarga

const preloadJob = (job) => {
    $("#editJobImg").value = job.img
    $("#editJobTitle").value = job.name
    $("#editJobDescription").value = job.description
    $("#editLocation").value = job.location
    $("#editSeniority").value = job.seniority
    $("#editCategory").value = job.category
    $("#editJobDetail").value = job.detail

}

//Objeto ya editado 
const jobEdited = () => {
    return{
        description: $("#editJobDescription").value,
        name : $("#editJobTitle").value,
        location: $("#editLocation").value ,
        category:$("#editCategory").value ,
        seniority:$("#editSeniority").value,
        img: $("#editJobImg").value ,
        detail: $("#editJobDetail").value,
    }
}

//Edita mock api

const editJob = (id) => {
      
    fetch(`https://6381400d9440b61b0d14b99a.mockapi.io/jobs/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(jobEdited())
    }).finally(() => window.location.href="index.html")
}

//Evento que lo ejecuta

$("#editForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const id = $("#submitEdited").getAttribute("data-id")
    editJob(id)
})


//CREAR UN TRABAJO

//Envia a mock api

const postNewJob = () => {
    fetch("https://6381400d9440b61b0d14b99a.mockapi.io/jobs", {
        method: "POST",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveNewJob())
    }).finally(() => window.location.href = "index.html")
}

//Funcion que crea un trabajo

const saveNewJob = () => {
   
    return  {
        description:$("#jobDescription").value,
        name:$("#jobTitle").value,
        location:$("#jobLocation").value,
        category:$("#jobCategory").value,
        seniority:$("#jobSeniority").value,
        img:$("#jobImg").value,
        detail:$("#jobDetail").value
    }
    
}

//Evento que lo ejecuta

$("#newJobForm").addEventListener('submit', (e) =>{
    e.preventDefault()
    postNewJob()
    $("#formCreateJob").reset()
})


//FILTROS

const filterBy = async (filterOption, filterValue) => {
    const response = await fetch(`https://6381400d9440b61b0d14b99a.mockapi.io/jobs?${filterOption}=${filterValue}`)
    const job = await response.json()
    return jobsCards(job)
}

//EVENTOS

//EVENTO ELEGIR FILTRO Y BUSCAR

$("#chooseFilter").addEventListener("change",(e) =>{

    if (e.target.value === "chooseByLocation"){
        showElement($("#filterLocation"))
        hideElement($("#filterSeniority"))
        hideElement($("#filterCategory"))
        showElement($("#filterButtons"))
        
        $("#searchBtn").addEventListener("click",()=> filterBy("location", $("#filterLocation").value))

    }    
    if (e.target.value === "chooseBySeniority"){
        showElement($("#filterSeniority"))
        hideElement($("#filterLocation"))
        hideElement($("#filterCategory"))
        showElement($("#filterButtons"))

        $("#searchBtn").addEventListener("click",()=> filterBy("seniority", $("#filterSeniority").value))

    }
    if (e.target.value === "chooseByCategory"){
       showElement($("#filterCategory"))
       hideElement($("#filterLocation"))
       hideElement($("#filterSeniority"))
       showElement($("#filterButtons"))

       $("#searchBtn").addEventListener("click",()=> filterBy("category", $("#filterCategory").value))

    }
    if(e.target.value === "choose"){
       hideElement($("#filterLocation"))
       hideElement($("#filterSeniority"))
       hideElement($("#filterCategory"))
       hideElement($("#filterButtons")) 
    }
})


//EVENTO LIMPIAR

$("#cleanBtn").addEventListener("click",()=>{
    $("#container").innerHTML= ""
    getJobs().then(data => jobsCards(data))

    $("#chooseFilter").value = "choose"
    hideElement($("#filterLocation"))
    hideElement($("#filterSeniority"))
    hideElement($("#filterCategory"))
    hideElement($("#filterButtons")) 
})

//EVENTOS NAV

$("#navJob").addEventListener('click', () =>{
    hideElement($("#filters"))
    hideElement($("#editJobForm"))
    $("#container").innerHTML= ""
    showElement($("#newJobForm"))
})


$("#navHome").addEventListener('click', () =>{
    showElement($("#spinner"))
    hideElement($("#newJobForm"))
    hideElement($("#editJobForm"))
    showElement($("#filters"))
    $("#chooseFilter").value = "choose"

    hideElement($("#filterLocation"))
    hideElement($("#filterSeniority"))
    hideElement($("#filterCategory"))
    hideElement($("#filterButtons")) 

    getJobs().then(data => jobsCards(data))
})


//EVENTO NAVBAR RESPONSIVE

$("#btnMenu").addEventListener('click', () => $("#menu").classList.toggle('hidden'))

//EVENTO CONDICIONES

$("#conditions").addEventListener('click', ()=>{
    showElement($("#conditionsContainer"))
    hideElement($("#container"))
    hideElement($("#newJobForm"))
    hideElement($("#editJobForm"))
    hideElement($("#filters"))
    hideElement($("#filterLocation"))
    hideElement($("#filterSeniority"))
    hideElement($("#filterCategory"))
    hideElement($("#filterButtons")) 
})