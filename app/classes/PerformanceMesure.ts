/**
 * This class will be used to mesure and return all the performance of a player during a game
 */

export class PerformanceMesure{

    private totalErrors: number;
    private totalCorrect: number;
    private time: number;

    private static instance: PerformanceMesure;
    
    private constructor(){
        this.totalErrors = 0;
        this.totalCorrect = 0;
        this.time = 0;
    }

    // Need to check threading safety
    public static getInstance(): PerformanceMesure{
        if(this.instance == null)
            this.instance = new PerformanceMesure();
        return this.instance;
    }

    public startGame(): void{
        if(this.hasStarted()){
            throw new Error("You cannot start a game that has already started.");
        }
        else{
            this.reset();
            this.time = Date.now();
        }

    }

    public reset(): void{ 
        this.totalErrors = 0;
        this.totalCorrect = 0;
        this.time = 0;
    }

    public endGame(): void{
        if(this.hasStarted())
            this.time = Date.now() - this.time;
        else
            throw new Error("You cannot end a game that has not started yet.");
    }

    public getElapsedTime(): number{
        return this.time;
    }

    public getConsistency(): number{
        return (this.totalCorrect / this.totalErrors) * 100;
    }

    public getWPM(): number{
        return (this.totalCorrect) / (this.time / 60000);
    }

    public getWPMWithErrors(): number{
        return (this.totalCorrect + this.totalErrors) / (this.time / 60000);
    }

    public getAccuracy(): number{
        return this.totalCorrect / (this.totalCorrect + this.totalErrors) * 100;
    }

    public addError(): void{
        this.totalErrors++;
    }

    public addCorrect(): void{
        this.totalCorrect++;
    }

    public getCharCount(): number{
        return this.totalCorrect + this.totalErrors;
    }

    public getTotalErrors(): number{
        return this.totalErrors;
    }

    public getTotalCorrect(): number{
        return this.totalCorrect;
    }

    public hasStarted (): boolean{
        return this.time != 0;
    }
    
}