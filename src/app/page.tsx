export default function Home() {

  const emotes = ["emote-1.svg", "emote-2.svg", "emote-3.svg", "emote-4.svg", "emote-5.svg", "emote-6.svg"];

  return (
    <div className="flex items-center justify-center w-full h-[100vh] flex-col p-4">
      <img src="/assests/name.svg" alt="Comapany Name" className="w-[369px] h-[51px] translate-y-12 " />
      <p className="text-white text-[15px] translate-y-10">If you can dream it, we can flavor it.</p>
      <div className="flex items-center justify-center flex-wrap gap-4 translate-y-20">
        {emotes.map((emote) => (
          <div
            key={emote}
            className="w-[90px] h-[90px] rounded-[20px] bg-[#071005] flex items-center justify-center drop-shadow-[0_4px_6px_rgba(168,255,0,0.3)]"
          >
            <img
              src={`/emotes/${emote}`}
              alt="emotes"
              className="w-[53.73px] h-[66.75px]"
            />
          </div>
        ))}
      </div>
      <p className="text-white font-medium text-[16px] translate-y-24">Gallery</p>
      <div className="flex items-center ml-3 overflow-y-auto gap-4 translate-y-28 z-50">
        <img src="/gallery/gallery-1.png" alt="gallery-image" className="w-[104px] h-[167px]" />
        <img src="/gallery/gallery-2.png" alt="gallery-image" className="w-[104px] h-[167px]" />
        <img src="/gallery/gallery-3.png" alt="gallery-image" className="w-[104px] h-[167px]" />
      </div>
      <img src="/assests/bottoms/home-bottom.png" alt="home-bottom" className="w-[700.27px] h-[169.38px] fixed -bottom-4 z-0" />
    </div>
  );
}
