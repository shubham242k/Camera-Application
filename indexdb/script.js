let accessButton = document.querySelector("#database-acess");
let submitButton = document.querySelector("#submit");
let viewButton = document.querySelector("#view-button");
let input = document.querySelector("#input");
let body = document.querySelector("body");
let db;

let temp = [
    {cId: 232125155 , note : "this is note 1"},
    {cId: 232235155 , note : "this is note 2"},
    {cId: 232125135 , note : "this is note 3"},
]
accessButton.addEventListener("click",function(e){
    let req = indexedDB.open("Notes", 1);
    req.addEventListener("upgradeneeded",function(e){
        let db = req.result;
        db.createObjectStore("csNotes",{keyPath:"cId"});
    })

    req.addEventListener("success",function(e){
        db = req.result;
        // console.log(db);
        accessAccepted = true;
        alert("access given")
    })

    req.addEventListener("error",function(e){
        accessAccepted = false;
    })
})

submitButton.addEventListener("click",function(e){
    if(db == undefined){ 
        alert("does not have access");
        return;
    }

    

    let tsc = db.transaction("csNotes","readwrite");

    let csObjectStore = tsc.objectStore("csNotes");

    let val = input.value;

    let data = {
        note : val,
        cId: Date.now()
    }

    csObjectStore.add(data);

})

viewButton.addEventListener("click",function(e){
    let table = document.querySelector("table");
    let isopen = viewButton.getAttribute("open");
    if(isopen == "true"){
        viewButton.setAttribute("open","false");
        table.innerHTML = "";
        return;
    }
    viewButton.setAttribute("open","true");
    let tsc = db.transaction("csNotes","readonly");

    let csObjectStore = tsc.objectStore("csNotes");

    let req = csObjectStore.openCursor();
    
    table.innerHTML = ` <tr>
                            <th>SNO.</th> <th> Notes</th> <th> Delete </th>
                        </tr>
                        <tbody>
                            
                        </tbody>`

    tbody = table.querySelector("tbody");
    let i = 1;
    req.addEventListener("success",function(e){
        let cursor = req.result;
        if(cursor){
            curObj = cursor.value;
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${i}</td>
                            <td>${curObj.note}</td>
                            <td><button data-cId= ${curObj.cId}>Delete</button></td>`;
            
            let deletebutton = tr.querySelector("button");
            deletebutton.addEventListener("click",function(e){
                let cid = Number(e.currentTarget.getAttribute("data-cId"));
                deleteFromDataBase(cid);
                e.currentTarget.parentElement.parentElement.remove();

            })
            tbody.append(tr);
            i++;
            cursor.continue();
        }
    })


})


function deleteFromDataBase(cid){
    let tsc = db.transaction("csNotes","readwrite");

    tsc.objectStore("csNotes").delete(cid);
}



