export default function scrollToBottom(haveNewMessage = 0) {
  const list = document.getElementById("messages-list")

  if (list) {
    list.scrollTo({
      top: list.scrollHeight + haveNewMessage,
      behavior: "smooth",
    })
  }
}
