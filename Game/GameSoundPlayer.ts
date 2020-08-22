import { SoundPlayer, SoundLoader, SoundName } from "../Core/_exports";
import { MainWindow } from "../Game/_exports";
import { GhostState } from "../Ghosts/_exports";

declare var Howler: any;

export class GameSoundPlayer {
    private readonly _siren: SoundPlayer;
    private readonly _frightened: SoundPlayer;
    private readonly _ghostEyes: SoundPlayer;
    private readonly _munch1: SoundPlayer;
    private readonly _munch2: SoundPlayer;
    private readonly _cutscene: SoundPlayer;
    private readonly _anthem: SoundPlayer;

    constructor(private readonly _loader: SoundLoader) {

        if (_loader == undefined) {
            throw new Error("Loader is undefined");
        }

        window.addEventListener("volumeChanged", this._volumeChanged);

        this._frightened = _loader.getSound(SoundName.Frightened);
        this._ghostEyes = _loader.getSound(SoundName.GhostEyes);

        this._siren =  _loader.getSound(SoundName.Siren1);

        this._munch1 = _loader.getSound(SoundName.Munch1);
        this._munch2 = _loader.getSound(SoundName.Munch2);
        this._cutscene = _loader.getSound(SoundName.CutScene);
        this._anthem = _loader.getSound(SoundName.Anthem);

        this._frightened.loop = true;
        this._ghostEyes.loop = true;

        this._ghostEyes.mute();
        this._ghostEyes.play();

        this._siren.loop = true;
        this._siren.volume = .5;
        this._frightened.volume = .20;
        this._frightened.loop = true;
        this._munch1.volume = .5;
        this._munch2.volume = .5;
        this._cutscene.volume = .4;
        this._anthem.loop = true;
    }

    private _volumeChanged = (e: any) => {
        const vol = <number>e.detail;

        Howler.volume(vol);
    }


    reset() {
        this._siren.stop();
        this._ghostEyes.stop();
        this._frightened.stop();
    }

    update() {
        const currentPlayerStats = MainWindow.gameStats.currentPlayerStats;
        const thereAreEyes = MainWindow.actors.ghosts.some(g => g.state === GhostState.Eyes);
        const frightSession = currentPlayerStats.frightSession;

        const handleFright = () => {
            if (thereAreEyes) {
                return;
            }

            if (frightSession != undefined) {
                const volume = frightSession.isFinished ? .5 : 0;

                this._siren.volume = volume;

                if (frightSession.isFinished) {
                    this._frightened.stop();
                }
            }
        };

        const handleSiren = () => {
            if (thereAreEyes) {
                return;
            }

            this.playSiren();
        };

        const handleEyes = () => {
            if (thereAreEyes === false) {
                this._ghostEyes.stop();
            } else {
                this._ghostEyes.play();
            }
        };

        if (currentPlayerStats != null) {
            handleFright();
            handleSiren();
            handleEyes();
        }
    }

    muteAll() {
        Howler.mute(true);
    }

    unmuteAll() {
        Howler.mute(false);
    }

    powerPillEaten(): any {
        this.play(SoundName.Frightened);
    }

    fruitEaten(): any {
        this.play(SoundName.FruitEaten);
    }

    ghostEaten(): any {
        this.play(SoundName.GhostEaten);
        this.play(SoundName.GhostEyes);        
    }

    gotExtraLife(): any {
        this.play(SoundName.ExtraLife);        
    }

    cutScene(): any {
        this.play(SoundName.CutScene);
    }

    pacManDying(): any {
        this.play(SoundName.PacManDying);
    }

    playerStart(): any {
        this.play(SoundName.PlayerStart);        
    }

    coinInsterted(): any {
        this.tryPlay(SoundName.CoinInserted);        
    }

    munch1(): any {
        this.play(SoundName.Munch1);        
    }

    munch2(): any {
        this.play(SoundName.Munch2);        
    }

    playAnthem(): any {
        this.play(SoundName.Anthem);        
    }

    private play(soundName: SoundName) {
        const audio = this._loader.getSound(soundName);
        if (audio.isLoaded) {
            audio.play();
        }
    }

    private tryPlay(soundName: SoundName) {
        const audio = this._loader.getSound(soundName);
        if (audio.isLoaded) {
            audio.tryPlay();
        }
    }

    private playSiren() {
        const siren = this._siren;
        if (!siren.isPlaying) {
            siren.play();
        }
    }
}
