// import { GET } from "./createImg/route.tsx";
// import "@types/chrome"
const gei = (id: string) => {
	return document.getElementById(id);
};
const gec = (classname: string, num = 0) => {
	return document.getElementsByClassName(classname)[num]?.innerHTML?.replace(/\s/g, "");
};
const rgb2hex = (inputrgba: string | undefined) => {
	if (!inputrgba) return;
	const rgba = inputrgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
	return rgba && rgba.length === 5
		? `${`0${Number.parseInt(rgba[1]).toString(16)}`.slice(-2)}${`0${Number.parseInt(rgba[2]).toString(16)}`.slice(-2)}${`0${Number.parseInt(rgba[3]).toString(16)}`.slice(-2)}${`0${(255 * Number.parseFloat(rgba[4])).toString(16)}`.slice(-2)}`
		: "";
};
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	if (request.message === "screenshot") {
		const elem = gei("rerere");
		if (elem) {
			const tracktitle = document.getElementsByClassName("Track_title")[0].innerHTML;
			const trackartist = document.getElementsByClassName("Track_artist")[0].innerHTML;
			const difficulty = gec("Track_difficulty");
			const score = gec("Score_value");
			const rank = gec("Rank_value");
			const message = `Sparebeatの「${tracktitle}/${trackartist}」(${difficulty}) で${score}点(ランク${rank})を獲得しました！`;
			const options =
				(gec("Track_layout") ? `&${gec("Track_layout")}=` : "") +
				(gec("Track_bind") ? `&${gec("Track_bind")}=` : "");
			const baseURL = "https://sparebeatter.vercel.app/result";
			if (!elem) throw new Error();
			const bgi = elem.style.backgroundImage;
			const querys = `?title=${encodeURIComponent(tracktitle)}&artist=${encodeURIComponent(trackartist)}&difficult=${difficulty.toLowerCase()}${options.toLowerCase()}&score=${score}&diff=${gec("Score_diff") ?? "none".replace(/[\[\]]/g, "")}&rank=${gec("Rank_value")}&just=${gec("Detail_table_row_value", 0)}&rush=${gec("Detail_table_row_value", 1)}&cool=${gec("Detail_table_row_value", 2)}&miss=${gec("Detail_table_row_value", 3)}&average=${gec("Average_value").replace(/ms/g, "")}&chain=${gec("Detail_table_row_value", 4)}&attack=${gec("Detail_table_row_value", 5).replace(/%/g, "")}&backcolor1=${rgb2hex(bgi.match(/rgba\((.*?)\)/g)?.[0])}&backcolor2=${rgb2hex(bgi.match(/rgba\((.*?)\)/g)?.[1])}&src=${request.src}`;
			let img: Blob | undefined = undefined;
			// if (request.src === "copyphoto") {
			// 	img = await (await GET(baseURL + querys)).blob();
			// }

			sendResponse({
				message: message,
				url: baseURL + querys,
				img,
			});
		} else {
			sendResponse({ message: "noresult" });
		}
		return true;
	}
});
