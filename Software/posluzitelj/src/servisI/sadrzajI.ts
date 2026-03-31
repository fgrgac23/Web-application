export interface SadrzajI {
	sadrzaj_id?: number;
	naziv: string;
	autor: string;
	putanja: string;
	vrsta: string;
	naslov: string;
	izvor: string;
	datum: string;
	javno: number;
	velicina: number;
	tmdb_id: number | null;
	yt_video_id: number | null;
}
