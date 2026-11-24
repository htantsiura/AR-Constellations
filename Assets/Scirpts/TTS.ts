@component
export class TTSCommandsPlayer extends BaseScriptComponent {

    // Встроенный модуль синтеза речи Lens Studio
    private ttsModule = require("LensStudio:TextToSpeechModule");

    // Компонент AudioComponent для воспроизведения сгенерированного звука
    @input
    audioComponent!: AudioComponent;

    // Список ваших текстовых команд, задаваемый в инспекторе
    @input
    commandsList: string[] = [
        "Поверните налево",
        "Сделайте шаг вперед",
        "Поднимите руку"
    ];

    private currentCommandIndex: number = 0;

    onAwake(): void {
        if (!this.audioComponent) {
            print("Пожалуйста, назначьте AudioComponent в инспекторе!");
            return;
        }

        // Пример: озвучиваем первую команду из списка при старте
        this.speakCommand(0);
    }

    /**
     * Синтезирует и озвучивает команду по её индексу из массива
     */
    public speakCommand(index: number): void {
        if (index < 0 || index >= this.commandsList.length) {
            print("Индекс команды выходит за пределы массива!");
            return;
        }

        let textToSay = this.commandsList[index];
        print(`Синтезируем речь для команды: "${textToSay}"`);

        // 1. Создаем параметры для TTS
        let options = TextToSpeech.Options.create();
        // Можно настроить имя голоса (например, SAM, SASSY и др.), если нужно
        // options.voiceName = TextToSpeech.VoiceNames...;

        // 2. Вызываем генерацию речи
        this.ttsModule.synthesize(
            textToSay,
            options,
            (audioTrackAsset: AudioTrackAsset, wordInfo: string, phonemeInfo: string, voiceStyle: any) => {
                // Колбэк успешного синтеза: получаем AudioTrackAsset
                this.playGeneratedAudio(audioTrackAsset);
            },
            (error, description) => {
                // Колбэк ошибки
                print(`Ошибка синтеза речи TTS (${error}): ${description}`);
            }
        );
    }

    /**
     * Озвучивает произвольный текст, переданный аргументом
     */
    public speakCustomText(text: string): void {
        let options = TextToSpeech.Options.create();
        this.ttsModule.synthesize(
            text,
            options,
            (audioTrackAsset: AudioTrackAsset) => {
                this.playGeneratedAudio(audioTrackAsset);
            },
            (error, desc) => print(`Ошибка TTS: ${desc}`)
        );
    }

    /**
     * Воспроизводит полученный трек через AudioComponent
     */
    private playGeneratedAudio(track: AudioTrackAsset): void {
        // Назначаем сгенерированный трек в AudioComponent и запускаем воспроизведение
        this.audioComponent.audioTrack = track;
        this.audioComponent.play(1); // 1 повтор
    }

    /**
     * Метод для переключения и озвучки следующей команды из списка
     */
    public speakNextCommand(): void {
        this.currentCommandIndex = (this.currentCommandIndex + 1) % this.commandsList.length;
        this.speakCommand(this.currentCommandIndex);
    }
}