package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"text/template"
)

type FontDef struct {
	ShortName  string `json:"shortName"`
	CssName    string `json:"cssName"`
	Variant    string `json:"variant"`
	Fallback   string `json:"fallback"`
	Fontsource bool   `json:"fontsource"`
}

type SiteFonts struct {
	Main         FontDef `json:"main"`
	Nav          FontDef `json:"nav"`
	PageTitle    FontDef `json:"pageTitle"`
	LandingTitle FontDef `json:"landingTitle"`
	Header       FontDef `json:"header"`
}

func runPnpmAdd(distinctFonts []string) {
	args := make([]string, 0, len(distinctFonts)+1)
	args = append(args, "add")

	for _, f := range distinctFonts {
		pack := fmt.Sprintf("@fontsource/%s", f)
		args = append(args, pack)
	}

	addCmd := exec.Command("pnpm", args...)
	out, err := addCmd.CombinedOutput()
	log.Println(string(out))
	if err != nil {
		log.Fatal(err)
	}

}

func distinctFonts(fonts SiteFonts) (f []string) {
	distinctFonts := make(map[string]bool)
	if fonts.Main.Fontsource {
		distinctFonts[fonts.Main.ShortName] = true
	}
	if fonts.Nav.Fontsource {
		distinctFonts[fonts.Nav.ShortName] = true
	}
	if fonts.PageTitle.Fontsource {
		distinctFonts[fonts.PageTitle.ShortName] = true
	}
	if fonts.LandingTitle.Fontsource {
		distinctFonts[fonts.LandingTitle.ShortName] = true
	}
	if fonts.Header.Fontsource {
		distinctFonts[fonts.Header.ShortName] = true
	}

	f = make([]string, 0, len(distinctFonts))
	for k := range distinctFonts {
		f = append(f, k)
	}

	return
}

func generateLoaderScript(distinctFonts []string) {

	fmt.Println(distinctFonts)
	t, err := template.New("fonts-script").Parse(
		`{{ range $i, $a := . -}}
import '@fontsource/{{ $a }}';
{{ end }}
`)

	if err != nil {
		log.Fatal(err)
	}

	file, err := os.Create("../../src/lib/loadFonts.js")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	err = t.Execute(file, distinctFonts)
	if err != nil {
		log.Fatal(err)
	}
}

func generateFontsCss(fonts SiteFonts) {

	t, err := template.New("fonts-spec").Parse(
		`:root {
	--main-font-family: {{ .Main.CssName }}, {{ .Main.Fallback }};
	--main-font-variant: {{ .Main.Variant }};
	--nav-font-family: {{ .Nav.CssName }}, {{ .Nav.Fallback }};
	--nav-font-variant: {{ .Nav.Variant }};
	--landing-title-font-family: {{ .LandingTitle.CssName }}, {{ .LandingTitle.Fallback }};
	--landing-title-font-variant: {{ .LandingTitle.Variant }};
	--page-title-font-family: {{ .PageTitle.CssName }}, {{ .PageTitle.Fallback }};
	--page-title-font-variant: {{ .PageTitle.Variant }};
	--header-font-family: {{ .Header.CssName}}, {{ .Header.Fallback }};
	--header-font-variant: {{ .Header.Variant }};
}`)

	if err != nil {
		log.Fatal(err)
	}

	file, err := os.Create("../../static/fonts.css")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	err = t.Execute(file, fonts)
	if err != nil {
		log.Fatal(err)
	}

}

func main() {

	j, err := os.Open("../../src/lib/conf/fonts.json")
	if err != nil {
		log.Fatal(err)
	}
	defer j.Close()

	b, err := io.ReadAll(j)
	if err != nil {
		log.Fatal(err)
	}

	var fonts SiteFonts
	json.Unmarshal(b, &fonts)

	generateFontsCss(fonts)

	dFonts := distinctFonts(fonts)

	runPnpmAdd(dFonts)
	generateLoaderScript(dFonts)

}
