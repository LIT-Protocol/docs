window.onload = function () {
  setTimeout(() => {
    document
      .querySelectorAll(".repls")
      .forEach((f) => (f.style.display = "block"));
    console.log("onload");
  }, 200);
};
