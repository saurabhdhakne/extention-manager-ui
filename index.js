// const fs = require('fs');

fetch("data.json")
  .then((response) => response.json())
  .then(async (data) => {
    if (data.created_at === "") {
      await chrome.bookmarks.getTree(async function (bookmarkTreeNodes) {
        data.collection = await bookmarkTreeNodes[0].children;
        const now = new Date();
        data.created_at = now.getTime();
        console.dir(data);
        const myjson = JSON.stringify(data);
        data.collection[0].children.forEach(element => {
          p = document.createElement('p');
          p.setAttribute("class", "cb-draggable");
          p.setAttribute("draggable", "true");
          p.innerText = element.title;
          document.getElementById('bmc-1').appendChild(p);
          const draggables = document.querySelectorAll('.cb-draggable')
          const containers = document.querySelectorAll('.container-bookmark')

          window.requestAnimationFrame(async function() {
              draggables.forEach(draggable =>{
                draggable.addEventListener('dragstart', ()=>{
                  draggable.classList.add('dragging')
                  console.log("dragstart")
                  console.dir(draggable)
                })
      
                draggable.addEventListener('dragend', ()=>{
                  draggable.classList.remove('dragging')
                  console.log("dragend")
                  console.dir(draggable)
                })
              })
      
              containers.forEach(container =>{
                container.addEventListener('dragover', e => {
                  e.preventDefault()
                  const afterElement = getDragAfterElement(container, e.clientY)
                  const draggable = document.querySelector('.dragging')
                  if(afterElement == null){
                    container.appendChild(draggable)
                  }else{
                    container.insertBefore(draggable, afterElement)
                  }
                })
              })
      
              function getDragAfterElement(container, y){
                const draggableElements = [...container.querySelectorAll('.cb-draggable:not(.dragging)')]
                
                return draggableElements.reduce((closest, child) => {
                  const box = child.getBoundingClientRect()
                  const offset = y - box.top - box.height / 2
                  if(offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child }
                  } else{
                    return closest
                  }
                },{offset:Number.NEGATIVE_INFINITY}).element
              }
          });

        });
      });
    }
  })
  .catch((error) => {
    console.error(error);
  });
