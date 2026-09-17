import { afterEach, describe, expect, it, vi } from "vitest";
import { searchWikipedia, wikipediaDetails } from "./wikimedia";

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
afterEach(() => vi.unstubAllGlobals());

describe("Wikimedia server validation", () => {
  it("limits and sanitizes search results", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ query: { search: [{ pageid: 42, title: "Tour Eiffel", snippet: "<b>Monument</b>  de Paris" }] } })));
    await expect(searchWikipedia("Tour Eiffel integration", "fr")).resolves.toEqual([{ pageId: 42, title: "Tour Eiffel", description: "Monument de Paris" }]);
  });
  it("rejects a page without a usable image", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ query: { pages: [{ pageid: 43, title: "Sans image", fullurl: "https://fr.wikipedia.org/wiki/Sans_image" }] } })));
    await expect(wikipediaDetails("fr", 43)).rejects.toThrow("No usable Wikimedia image");
  });
  it("rejects an image with a non-free license", async () => {
    const mock = vi.fn().mockResolvedValueOnce(response({ query: { pages: [{ pageid: 44, title: "Protégée", fullurl: "https://fr.wikipedia.org/wiki/Prot%C3%A9g%C3%A9e", pageimage: "Protected.jpg", original: { source: "https://upload.wikimedia.org/test.jpg" } }] } })).mockResolvedValueOnce(response({ query: { pages: [{ imageinfo: [{ url: "https://upload.wikimedia.org/test.jpg", extmetadata: { LicenseShortName: { value: "All rights reserved" } } }] }] } }));
    vi.stubGlobal("fetch", mock);
    await expect(wikipediaDetails("fr", 44)).rejects.toThrow("Image license is not eligible");
  });
  it("keeps attribution and bilingual data from a verified free image", async () => {
    const mock = vi.fn().mockResolvedValueOnce(response({ query: { pages: [{ pageid: 45, title: "Sujet", extract: "Résumé FR", fullurl: "https://fr.wikipedia.org/wiki/Sujet", pageimage: "Sujet.jpg", original: { source: "https://upload.wikimedia.org/original.jpg" } }] } })).mockResolvedValueOnce(response({ query: { pages: [{ imageinfo: [{ url: "https://upload.wikimedia.org/original.jpg", extmetadata: { LicenseShortName: { value: "CC BY-SA 4.0" }, LicenseUrl: { value: "https://creativecommons.org/licenses/by-sa/4.0/" }, Artist: { value: "Auteur Wikimedia" } } }] }] } })).mockResolvedValueOnce(response({ query: { pages: [{ langlinks: [{ lang: "en", title: "Topic" }] }] } })).mockResolvedValueOnce(response({ query: { pages: [{ pageid: 46, title: "Topic", extract: "English summary" }] } }));
    vi.stubGlobal("fetch", mock);
    const details = await wikipediaDetails("fr", 45);
    expect(details.names).toEqual({ fr: "Sujet", en: "Topic" });
    expect(details.source.license).toBe("CC BY-SA 4.0");
    expect(details.source.author).toBe("Auteur Wikimedia");
  });
});
