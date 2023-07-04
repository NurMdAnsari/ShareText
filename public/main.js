let list = document.querySelector("ul");
let loader = document.querySelector(".lds-facebook");
let fill = document.querySelector(".fill");
let empty = document.querySelector(".empty");

function Empty() {
  fill.style.display = "none";
  empty.style.display = "inline-block";
}
Empty();
function Fill() {
  fill.style.display = "inline-block";
  empty.style.display = "none";
}
let interval;
async function getText(
  isError = false,
  isSuccess = false,
  secret = "nothere"
) {
  if (interval) {
    clearTimeout(interval);
  }
  fetch(`gettext?value=${secret}`)
    .then((res) => res.json())
    .then((data) => {
      loader.style.display = "none";
      if (data.msg) {
        let li = document.createElement("li");
        li.style.cursor = "pointer";
        li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg></span>`;
        li.classList.add("error");
        list.insertBefore(li, list.childNodes[0]);
        // list.appendChild(li);
        return;
      }

      if (isError) {
        let li = document.createElement("li");
        li.style.cursor = "pointer";
        li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg></span>`;
        li.classList.add("error");
        list.insertBefore(li, list.childNodes[0]);
        // list.appendChild(li);
        return;
      }
      list.innerHTML = " ";
      if (data.length === 0) {
        let li = document.createElement("li");
        li.innerHTML = "No text to display";
        li.classList.add("no-text");
        list.appendChild(li);
        Empty();
        return;
      }

      data.forEach((text) => {
        let li = document.createElement("li");
        li.textContent = text.text;
        li.dataset.id = text._id;
        li.dataset.important = text.important;
        li.dataset.date = text.created;
        li.dataset.pin = text.pin;
        li.dataset.hidden = text.hidden;

        if (text.important) {
          if (text.pin) {
            li.classList.add("bg-danger", "text-white", "hover1");
          } else {
            li.classList.add("bg-dark", "text-white", "hover");
          }
        } else if (text.pin) {
          if (text.important) {
            li.classList.add("bg-danger", "text-white", "hover1");
          } else {
            li.classList.add("bg-warning");
          }
        }
        if (text.created == "Just now" || text.created == "1 min. ago") {
          li.classList.add("bg-success", "text-white");
        }
        if (text.hidden) {
          li.classList.add("bg-info", "text-white");
        }

        list.appendChild(li);

        Fill();
      });
    })
    .catch((err) => {
      let li = document.createElement("li");
      li.style.cursor = "pointer";
      li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg></span>`;
      li.classList.add("error");
      list.innerHTML = "";
      list.insertBefore(li, list.childNodes[0]);
      // list.appendChild(li);
    });

  interval = setInterval(getText, 1000 * 60 * 1);
}

function deleteOne(id) {
  loader.style.display = "inline-block";
  fetch("deleteone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.msg == "Server error") {
        throw new Error();
      }
      let removed = document.querySelector(`li[data-id='${id}']`);
      removed.remove();
      loader.style.display = "none";
      getText();
    })
    .catch((err) => {
      let li = document.createElement("li");
      li.style.cursor = "pointer";
      li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg></span>`;
      li.classList.add("error");
      list.appendChild(li);
      let firstChild = list.firstChild;
      list.insertBefore(li, firstChild);
      loader.style.display = "none";
    });
}
list.addEventListener("DOMNodeInserted", function (event) {
  const newNode = event.target;

  if (newNode.nodeName === "LI") {
    if (newNode.classList.contains("error")) {
      if (newNode.querySelectorAll(".error").length >= 1) {
        newNode.remove();
      } else {
        newNode.classList.add(
          "d-flex",
          "justify-content-center",
          "align-items-center",
          "pe-1",
          "mb-2",
          "alert",
          "alert-danger",
          "hover5"
        );
        newNode.addEventListener("click", () => {
          window.open("/", "_self");
        });
      }
      return;
    }
    if (newNode.classList.contains("no-text")) {
      newNode.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "pe-1",
        "mb-2",
        "bg-secondary",
        "text-white"
      );
      return;
    }

    newNode.classList.remove("justify-content-center");
    newNode.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "pe-1",
      "mb-2",
      "w-100",
      "text-wrap",
      "text-break"
    );

    const text = newNode.textContent.trim();
    newNode.innerHTML += `<span style="flex-shrink:0" class='d-flex ps-3 before1'><span class="d-none d-md-inline text-muted contain date1 pe-2">${newNode.dataset.date}</span><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" class="bi bi-clipboard me-2 copy" viewBox="0 0 16 16">
<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
</svg>
<div class="dropdown">
<span class="d-flex justify-content-center align-items-center drop" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" class="bi bi-three-dots-vertical dots" viewBox="0 0 16 16">
<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
</svg>
</span>
<ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">

<li><a class="dropdown-item text-info fw-bold d-flex justify-content-between align-items-center font-weight-bold important" href="#"><span></span>Mark Important<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2 bi bi-star-fill" viewBox="0 0 16 16">
<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg></a></li>
<li><a class="dropdown-item text-warning d-flex justify-content-between align-items-center pintop" href="#"><span ></span>Pin to Top<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle-fill" viewBox="0 0 16 16">
<path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
</svg></a></li>

<li class="d-inline d-md-none j1"><a class="dropdown-item text-success d-flex justify-content-between align-items-center" href="#"><span ></span>Info<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
</svg></a></li>

<li><hr class="dropdown-divider"></li>

<li><a class="dropdown-item fw-bold text-danger d-flex justify-content-between align-items-center delete" href="#"><span></span>Delete<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2-fill" viewBox="0 0 16 16">
<path d="M2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"/>
</svg></a></li>
</ul>
</div>

</span><svg style="position:absolute;right:-0.6em;top:-0.5em;display:none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-star-fill text-info pinstar " viewBox="0 0 16 16">
<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg><svg style="position:absolute;right:-0.6em;top:0.3em;display:none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-pin-angle-fill text-danger pinicon" viewBox="0 0 16 16">
<path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
</svg>`;

    newNode.querySelector(".j1").addEventListener("click", (e) => {
      list.querySelectorAll(".date1").forEach((item) => {
        item.classList.toggle("d-none");
        item.style.display = "inline-block";
      });
    });

    const contain = newNode.querySelector(".contain");
    const copyIcon = contain.nextElementSibling;
    copyIcon.addEventListener("click", function (e) {
      this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check checked" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
</svg> `;
      let text = newNode.innerHTML
        .substring(
          0,
          newNode.innerHTML.indexOf(
            '<span style="flex-shrink:0" class="d-flex ps-3 before1">'
          )
        )
        .trim();

      //copy for android

      let TempText = document.createElement("input");
      TempText.value = text;
      document.body.appendChild(TempText);
      TempText.select();

      document.execCommand("copy");
      document.body.removeChild(TempText);

      //end

      setTimeout(() => {
        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard copy" viewBox="0 0 16 16">
<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
</svg>`;
      }, 2000);
    });

    let pintop = newNode.querySelector(".pintop");

    pintop.addEventListener("click", function (e) {
      loader.style.display = "inline-block";
      fetch("pintop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: newNode.dataset.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.pin == true) {
            newNode.classList.add("bg-warning");
            newNode
              .querySelector(".date1")
              .classList.remove("text-muted");

            let nodeText = newNode.querySelector(".pintop");
            let mainText = nodeText.innerHTML.replace(
              "Pin to Top",
              "UnPin"
            );
            nodeText.innerHTML = mainText;

            getText();
          } else {
            newNode.classList.remove("bg-warning");
            newNode.querySelector(".date1").classList.add("text-muted");
            let nodeText = newNode.querySelector(".pintop");
            let mainText = nodeText.innerHTML.replace(
              "UnPin",
              "Pin to Top"
            );
            nodeText.innerHTML = mainText;
            getText();
          }
          loader.style.display = "none";
        })
        .catch((err) => {
          let li = document.createElement("li");
          li.style.cursor = "pointer";
          li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg></span>`;
          li.classList.add("error");
          list.appendChild(li);
          let firstChild = list.firstChild;
          list.insertBefore(li, firstChild);
          loader.style.display = "none";
        });

      if (newNode.dataset.hidden) {
        newNode.classList.add("bg-info", "text-white");
      }
    });

    newNode
      .querySelector(".delete")
      .addEventListener("click", function (ef) {
        ef.preventDefault();
        deleteOne(newNode.dataset.id);
      });
    newNode
      .querySelector(".important")
      .addEventListener("click", function (eg) {
        loader.style.display = "inline-block";
        fetch("important", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: newNode.dataset.id }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.important) {
              newNode.classList.add("bg-dark", "text-white", "hover");
              newNode.dataset.important = "true";
              let nodeText = this;

              let mainText = nodeText.innerHTML.replace(
                "Mark Important",
                "Mark UnImportant"
              );
              nodeText.innerHTML = mainText;
              newNode.querySelector(".pinstar").style.display = "block";
            } else {
              newNode.classList.remove("bg-dark", "text-white", "hover");
              newNode.dataset.important = "false";
              let nodeText = this;

              let mainText = nodeText.innerHTML.replace(
                "Mark UnImportant",
                "Mark Important"
              );
              nodeText.innerHTML = mainText;
              newNode.querySelector(".pinstar").style.display = "none";
            }
            loader.style.display = "none";
            getText();
          })
          .catch((err) => {
            let li = document.createElement("li");
            li.style.cursor = "pointer";
            li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg></span>`;
            li.classList.add("error");
            list.appendChild(li);
            let firstChild = list.firstChild;
            list.insertBefore(li, firstChild);
            loader.style.display = "none";
          });
      });

    if (newNode.dataset.important == "true") {
      let nodeText = newNode.querySelector(".important");
      let mainText = nodeText.innerHTML.replace(
        "Mark Important",
        "Mark UnImportant"
      );
      nodeText.innerHTML = mainText;

      newNode.querySelector(".pinstar").style.display = "block";
    } else {
      let nodeText = newNode.querySelector(".important");
      let mainText = nodeText.innerHTML.replace(
        "Mark UnImportant",
        "Mark Important"
      );

      nodeText.innerHTML = mainText;
      newNode.querySelector(".pinstar").style.display = "none";
    }

    if (newNode.dataset.pin == "true") {
      newNode.querySelector(".pinicon").style.display = "block";
      newNode.classList.add("bg-warning", "text-white");
      newNode.querySelector(".date1").classList.remove("text-muted");
      let nodeText = newNode.querySelector(".pintop");
      let mainText = nodeText.innerHTML.replace("Pin to Top", "UnPin");
      nodeText.innerHTML = mainText;
    } else {
      newNode.querySelector(".pinicon").style.display = "none";
      newNode.classList.remove("bg-warning");
      newNode.querySelector(".date1").classList.add("text-muted");
      let nodeText = newNode.querySelector(".pintop");
      let mainText = nodeText.innerHTML.replace("UnPin", "Pin to Top");
      nodeText.innerHTML = mainText;
    }
    if (
      newNode.dataset.date == "Just now" ||
      newNode.dataset.date == "1 min. ago"
    ) {
      newNode.querySelector(".date1").classList.remove("text-muted");
    }
  }
});

list.addEventListener("mouseover", (e) => {
  const target = e.target;
  if (target.nodeName === "LI") {
    if (
      target.dataset.date == "Just now" ||
      target.dataset.date == "1 min. ago"
    ) {
      target.classList.remove("bg-success", "text-white");
    }
    target.classList.toggle("bg-secondary");
    target.classList.toggle("text-white");
    if (
      target.dataset.pin == "true" ||
      target.dataset.important == "true"
    ) {
      if (
        target.dataset.pin == "true" &&
        target.dataset.important == "true"
      ) {
        target.classList.remove("bg-danger", "bg-warning", "bg-success");
      } else if (target.dataset.important == "true") {
        target.classList.remove("bg-dark");
      } else {
        target.classList.remove("bg-warning", "bg-success");
      }

      target.classList.add("bg-secondary", "text-white");
    }
    if (target.textContent != "No text to display") {
      if (!target.classList.contains("error")) {
        target.querySelector(".date1").classList.remove("text-muted");
      }
    }
  }
});
list.addEventListener("mouseout", (e) => {
  const target = e.target;
  if (target.nodeName === "LI") {
    target.classList.toggle("bg-secondary");
    target.classList.toggle("text-white");
    if (
      target.dataset.pin == "true" ||
      target.dataset.important == "true"
    ) {
      if (
        target.dataset.pin == "true" &&
        target.dataset.important == "true"
      ) {
        target.classList.add("bg-danger", "text-white");
      } else if (target.dataset.important == "true") {
        target.classList.add("bg-dark", "text-white");
      } else {
        target.classList.add("bg-warning", "text-white");
      }

      target.classList.remove("bg-secondary");
    }
    if (
      target.dataset.pin != "true" &&
      target.dataset.important != "true" &&
      target.dataset.date != "Just now" &&
      target.dataset.date != "1 min. ago"
    ) {
      if (target.textContent != "No text to display") {
        if (!target.classList.contains("error")) {
          target.querySelector(".date1").classList.add("text-muted");
        }
      }
    }
    if (
      target.dataset.date == "Just now" ||
      target.dataset.date == "1 min. ago"
    ) {
      target.classList.remove("text-dark");
      target.classList.add("bg-success", "text-white");
    }
  }
});

getText();

let form = document.querySelector('form[name="form1"]');
let reset = document.querySelector("#reset");
reset.addEventListener("click", (e) => {
  list.innerHTML = " ";
  loader.style.display = "inline-block";
  let text = document.querySelector('input[name="text"]');
  e.preventDefault();
  fetch("deletetext")
    .then((res) => res.json())
    .then((data) => {
      loader.style.display = "none";
      list.innerHTML = " ";
      getText();
      text.value = "";
      Empty();
    })
    .catch((err) => {
      getText();
      Fill();
    });
});

form.addEventListener("submit", (e) => {
  loader.style.display = "inline-block";
  e.preventDefault();
  let text = document.querySelector('input[name="text"]');
  if (text.value === "") {
    loader.style.display = "none";
    return;
  }
  let value = text.value;
  let data = {
    text: value,
  };

  fetch("addtext", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.msg) {
        throw new Error();
      }
      loader.style.display = "none";
      text.value = "";
   
      if (data.status) {
        getText(false, true, data.secret);
        Fill();
        return;
      }
      getText();
      Fill();
    })
    .catch((err) => {
      getText(true);
    });
});

let heading = document.querySelectorAll(".l1");
heading.forEach((e) => {
  e.addEventListener("click", (e) => {
    window.open("/", "_self");
  });
});