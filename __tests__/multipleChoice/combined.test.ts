import { dividePassage } from "@/features/cloze-generator/pipeline/dividePassage";
import { createTestData } from "@/features/cloze-generator/pipeline/pickDifficultWord";

const testsentence =
  "French President Emmanuel Macron is hosting Ukraine's leader Volodymyr Zelensky and other key allies of the country as efforts intensify to agree security guarantees for Kyiv in the event of a ceasefire with Russia. Heads of state and top officials from more than 30 countries - part of the so-called Coalition of the Willing - are taking part, including US mediators in peace talks Steve Witkoff and Jared Kushner, President Donald Trump's son-in-law. Zelensky met Trump recently and said his plan to end the war with Russia was 90% agreed. However, the proposals have yet to be presented to Russia, whose response so far has been far from encouraging. The outstanding 10% of the agreement that's yet to be decided concerns territorial concessions Kyiv is being asked to agree to. Moscow currently controls about 75% of the Donetsk region, and some 99% of the neighbouring Luhansk. The two regions form the industrial region of Donbas. Russia launched its full-scale invasion of Ukraine in February 2022 and has been making slow progress on the ground recently and, therefore, is unwilling to compromise on its aim to seize full control of Donbas. Russia has also consistently opposed any idea of a temporary ceasefire and has intensified its attacks in Ukraine, particularly aimed at paralysing its power supplies in the middle of a harsh winter.";

const test2 =
  "To some he was guilty of charlatanry, but I know better. Indeed, to me he would always be The Magnificent Mr. Melchior, “Mystic to Their Majesties of Moldova,” as his calling card advertised. His shows, or “supernatural spectacles,” as he was wont to term them, performed before the royal court, were naturally nothing short of marvelous. Under a single bright light that no doubt represented the sun, and with Egyptian flute music floating on the air, Mr. Melchior would suddenly appear in a puff of smoke, standing center stage in his impressively long, flowing magician’s robes and headwear somewhat redolent of an ancient high priest from the temple of Karnak on the banks of the Nile River. He would then proceed to put on breath-taking displays of his talent for conjuring, creating illusions, reading minds, charming snakes, disappearing and reappearing, making predictions and practicing prestidigitation, much to the amazement and delight of his audience. However, it was when one encountered him alone, one-on-one, in the intimate setting of the basement under his house, that one gained a true insight into his sublime skills. Only very dimly lit and rather damp, this, his “Cave of Mysteries,” as Mr. Melchior called it, was festoonedwith all manner of magical paraphernalia: old animal bones, bleached human skulls, dusty bottles housing curiously colored liquids, and hanging scrolls bearing ancient, arcane symbols. In the corner, stood a sturdy oak desk, upon which lay a mighty book bound with what appeared to be the hide of some mythical beast and with the symbol of an ouroboros, that is, a snake devouring its own tail and representing eternity, emblazoned across its cover. There, in the privacy of his underground magician’s study, Mr. Melchior, no longer the flamboyant showman that he appeared when above ground and occupying the stage before a large audience, would transmogrify into a quiet, contemplative and seriously intense scholar of the magical arts.";

describe("dividePassage", () => {
  it("selects difficult word", () => {
    const input = dividePassage(testsentence);
    // console.log(input);
    createTestData(input);
    expect(testsentence).toBe(testsentence);
  });
  it("selects difficult word", () => {
    const input = dividePassage(test2);
    // console.log(input);
    createTestData(input);
    expect(testsentence).toBe(testsentence);
  });
});
// pnpm test -- combined
// pnpm vitest __tests__/multipleChoice/combined.test.ts
