// #
// # English locale is the default and used as a fallback.
// #
const translations = {
        uploading: 'Ladataan… Odota hetki.',
        loadingInfo: 'Ladataan tietoja…',
        errors: {
            default: 'Virhe',
            baddata: 'Virheellinen arvo',
            size: 'Liian suuri tiedosto',
            upload: 'Lataus epäonnistui',
            user: 'Lataus peruttu',
            info: 'Tietoja ei voi ladata',
            image: 'Vain kuvat sallitaan',
            createGroup: 'Tiedostoryhmää ei voida luoda',
            deleted: 'Tiedosto poistettiin'
        },
        draghere: 'Pudota tiedosto tähän',
        file: {
            one: '%1 tiedosto',
            other: '%1 tiedostoa'
        },
        buttons: {
            cancel: 'Peruuta',
            remove: 'Poista',
            choose: {
                files: {
                    one: 'Valitse tiedosto',
                    other: 'Valitse tiedostot'
                },
                images: {
                    one: 'Valitse kuva',
                    other: 'Valitse kuvat'
                }
            }
        },
        dialog: {
            close: 'Sulje',
            openMenu: 'Avaa valikko',
            done: 'Valmis',
            showFiles: 'Näytä tiedostot',
            tabs: {
                names: {
                    'empty-pubkey': 'Tervetuloa',
                    preview: 'Esikatselu',
                    file: 'Paikalliset tiedostot',
                    url: 'Suora linkki',
                    camera: 'Kamera',
                    facebook: 'Facebook',
                    dropbox: 'Dropbox',
                    gdrive: 'Google Drive',
                    gphotos: 'Google Kuvat',
                    instagram: 'Instagram',
                    vk: 'VK',
                    evernote: 'Evernote',
                    box: 'Box',
                    onedrive: 'OneDrive',
                    flickr: 'Flickr',
                    huddle: 'Huddle',
                    nft: 'NFT'
                },
                file: {
                    drag: 'vedä & pudota<br>tiedostoja',
                    nodrop: 'Lataa tiedostoja&nbsp;tietokoneeltasi',
                    cloudsTip: 'Pilvitallennustilat<br>ja sosiaaliset verkostot',
                    or: 'tai',
                    button: 'Valitse paikallinen tiedosto',
                    also: 'tai valitse'
                },
                url: {
                    title: 'Tiedostoja verkosta',
                    line1: 'Nappaa mikä tahansa tiedosto verkosta.',
                    line2: 'Anna vain linkki.',
                    input: 'Liitä linkkisi tähän...',
                    button: 'Lataa'
                },
                camera: {
                    title: 'Tiedosto verkkokamerasta',
                    capture: 'Ota kuva',
                    mirror: 'Peilaa',
                    startRecord: 'Tallenna video',
                    stopRecord: 'Pysäytä',
                    cancelRecord: 'Peruuta',
                    retry: 'Pyydä käyttöoikeuksia uudelleen',
                    pleaseAllow: {
                        title: 'Salli kamerasi käyttö',
                        text:
                            'Sinua on pyydetty sallimaan kameran käyttö tältä sivustolta.<br>' +
                           'Jos haluat ottaa kuvia kamerallasi, sinun on hyväksyttävä tämä pyyntö.'
                    },
                    notFound: {
                        title: 'Kameraa ei löytynyt',
                        text: 'Näyttää siltä, että tähän laitteeseen ei ole kytketty kameraa.'
                    }
                },
                preview: {
                    unknownName: 'tuntematon',
                    change: 'Peruuta',
                    back: 'Takaisin',
                    done: 'Lisää',
                    unknown: {
                        title: 'Ladataan... Odota esikatselua.',
                        done: 'Ohita esikatselu ja hyväksy'
                    },
                    regular: {
                        title: 'Lisää tämä tiedosto?',
                        line1: 'Olet lisäämässä yllä olevaa tiedostoa.',
                        line2: 'Vahvista.'
                    },
                    image: {
                        title: 'Lisää tämä kuva?',
                        change: 'Peruuta'
                    },
                    crop: {
                        title: 'Rajaa ja lisää tämä kuva',
                        done: 'Valmis',
                        free: 'Vapaa rajaus'
                    },
                    video: {
                        title: 'Lisää tämä video?',
                        change: 'Peruuta'
                    },
                    error: {
                        default: {
                            title: 'Ups!',
                            text: 'Jokin meni pieleen latauksen aikana.',
                            back: 'Yritäthän uudelleen'
                        },
                        image: {
                            title: 'Vain kuvatiedostot hyväksytään.',
                            text: 'Ole hyvä ja yritä uudelleen toisella tiedostolla.',
                            back: 'Valitse kuva'
                        },
                        size: {
                            title: 'Valitsemasi tiedosto ylittää enimmäisrajan.',
                           text: 'Ole hyvä ja yritä uudelleen toisella tiedostolla.'
                        },
                        loadImage: {
                            title: 'Virhe',
                            text: 'Kuvaa ei voi ladata'
                        }
                    },
                    multiple: {
                        title: 'Olet valinnut %files%.',
                        question: 'Lisää %files%?',
                        tooManyFiles: 'Olet valinnut liian monta tiedostoa. %max% on maksimi.',
                        tooFewFiles: 'Valitsit %files%. Vähintään %min% vaaditaan.',
                        clear: 'Poista kaikki',
                        done: 'Lisää',
                        file: {
                            preview: 'Esikatsele %file%',
                            remove: 'Poista %file%'
                        }
                    }
                }
            },
            footer: {
                text: 'palvelun tarjoaa',
                link: 'uploadcare'
            }
        },
        serverErrors: {
            AccountBlockedError:
                "Ylläpitäjän tili on estetty. Ole hyvä ja ota yhteyttä tukeen.",
            AccountUnpaidError:
                "Ylläpitäjän tili on estetty. Ole hyvä ja ota yhteyttä tukeen.",
            AccountLimitsExceededError:
                "Ylläpitäjän tili on saavuttanut rajansa. Ole hyvä ja ota yhteyttä tukeen.",
            FileSizeLimitExceededError: 'Tiedosto on liian suuri.',
            MultipartFileSizeLimitExceededError: 'Tiedosto on liian suuri.',
            FileTypeForbiddenOnCurrentPlanError:
                'Näiden tiedostotyyppien lataaminen ei ole sallittua.',
            DownloadFileSizeLimitExceededError: 'Ladattu tiedosto on liian suuri.'
        }
    }
    
    // Pluralization rules taken from:
    // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html
    const pluralize = function (n) {
        if (n === 1) {
            return 'one'
        }
        return 'other'
    }
    
    export default { pluralize, translations }