export default function scrollToBottom() {
  const list = document.getElementById("messages-list")

  if (list) {
    list.scrollTo({
      top: list.scrollHeight,
      behavior: "smooth",
    })
  }
}
