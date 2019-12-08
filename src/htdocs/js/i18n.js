"use strict";

/*
	Available Variables (does not work with blocks)
	
	%NAME%:				NAO Robots assigned name
	%TIME_GREETING%:	Good morning, afternoon
	%LOCATION%:			The location the NAO is set to
	%USERNAME%:			Username of the current user
	%1..9%:				Used as count variables in code (eg scripts found)
*/

var nao_i18n = {
	languageNames: {		// Codes listed here are shown in the language select screen
		EN: 'English',
		IT: 'Italian'
	},
	
	languageCredits: {	// If you contribute to adding a language, place your credit here
		EN: 'James Collins',
		IT: ''
	},
	
	NAO_CADET: {
		EN: 'NAO Cadet',
		IT: 'NAO Cadet'
	},

	ERROR_JSON_PARSE: {
		EN: 'JSON parse error',
		IT: 'Errore di analisi JSON'
	},

	ERROR_CONNECTING_NAO: {
		EN: 'Error Connecting to NAO',
		IT: 'Errore durante la connessione a %NAME%'
	},
	
	ERROR_SETUP: {
		EN: 'There was an error setting up NAO Cadet',
		IT: 'Si è verificato un errore durante l\'impostazione del cadetto NAO'
	},
	
	ERROR_LOGIN: {
		EN: 'The NAO could not log you in because an error occurred',
		IT: 'Il NAO non è riuscito ad accedere perché si è verificato un errore'
	},
	
	ERROR_RENAME_FOLDER: {
		EN: 'Could not rename the folder because an error occurred',
		IT: 'Impossibile rinominare la cartella perché si è verificato un errore'
	},
	
	ERROR_RENAME_FILE: {
		EN: 'Could not rename the file because an error occurred',
		IT: 'Impossibile rinominare il file perché si è verificato un errore'
	},
	
	ERROR_LOADING_BEHAVIORS: {
		EN: 'There was a error getting the list of behaviors on the NAO',
		IT: 'Si è verificato un errore durante il recupero dell\'elenco dei comportamenti sul NAO'
	},
	
	ERROR_LOADING_MOVEMENT: {
		EN: 'There was a problem loading the movement',
		IT: 'Si è verificato un problema durante il caricamento del movimento'
	},
	
	ERROR_RUNNING_MOVEMENT: {
		EN: 'There was a problem running the movement',
		IT: 'Si è verificato un problema durante l\'esecuzione del movimento'
	},
	
	ERROR_MOVE_JOINTS: {
		EN: 'There was a problem moving the joints',
		IT: 'Si è verificato un problema durante lo spostamento delle articolazioni'
	},
	
	ERROR_SAVING_JOINTS: {
		EN: 'There was a problem saving the joints',
		IT: 'Si è verificato un problema durante il salvataggio delle articolazioni'
	},
	
	ERROR_LOADING_SOUNDS: {
		EN: 'There was a error getting the list of sounds on the NAO',
		IT: 'Si è verificato un errore durante il recupero dell\'elenco dei suoni sul NAO'
	},
	
	ERROR_LOADING_SCRIPTS: {
		EN: 'Error loading scripts',
		IT: 'Errore durante il caricamento degli script'
	},
	
	ERROR_LOADING_SCRIPT: {
		EN: 'Error loading script',
		IT: 'Errore durante il caricamento dello script'
	},
	
	ERROR_LOADING_MOTIONS: {
		EN: 'There was a error getting the list of motions on the NAO',
		IT: 'Si è verificato un errore durante il recupero dell\'elenco dei movimenti sulla NAO'
	},
	
	ERROR_SAVING_MOTION: {
		EN: 'There was a problem saving the motion',
		IT: 'Si è verificato un problema durante il salvataggio del movimento'
	},
	
	ERROR_MOTION_EXISTS: {
		EN: 'You cannot use that name for this motion as it already exists',
		IT: '"Non puoi usare quel nome per questa mozione in quanto esiste già'
	},
	
	ERROR_MOTION_UPLOAD: {
		EN: 'An problem occurred trying to upload the motion',
		IT: 'Si è verificato un problema durante il tentativo di caricare il movimento'
	},
	
	ERROR_MOTION_DELETE: {
		EN: 'An problem occurred trying to delete the motion',
		IT: 'Si è verificato un problema durante il tentativo di eliminare il movimento'
	},
	
	ERROR_MOTION_EXPORT: {
		EN: 'An problem occurred trying to export the motion',
		IT: 'Si è verificato un problema durante il tentativo di esportare il movimento'
	},
	
	ERROR_SCRIPT_INFO: {
		EN: 'There was an error getting information about the script',
		IT: 'Si è verificato un errore durante il recupero delle informazioni sullo script'
	},
	
	ERROR_DELETE_SCRIPT: {
		EN: 'There was an error deleting the script',
		IT: 'Si è verificato un errore durante l\'eliminazione dello script'
	},
	
	ERROR_DELETE_PHOTOVIDEO: {
		EN: 'An problem occurred trying to delete the photo/video',
		IT: 'Si è verificato un problema durante il tentativo di eliminare la foto / il video'
	},
	
	ERROR_GET_FOLDERS: {
		EN: 'There was an error getting what folders are on %NAME%',
		IT: 'Si è verificato un errore durante il recupero delle cartelle su %NAME%'
	},
	
	ERROR_UPLOADING_FILE: {
		EN: 'There was an error uploading the file',
		IT: 'Si è verificato un errore durante il caricamento del file'
	},
	
	ERROR_SAVE_SCRIPT: {
		EN: 'Your script could not be saved because an error occurred',
		IT: 'Impossibile salvare lo script perché si è verificato un errore'
	},
	
	ERROR_RUN_SCRIPT: {
		EN: 'An error occurred trying to run your script',
		IT: 'Si è verificato un errore durante il tentativo di eseguire lo script'
	},
	
	ERROR_GET_ORIGINAL_SCRIPT: {
		EN: 'There was an error getting the original script',
		IT: 'Si è verificato un errore durante il recupero dello script originale'
	},
	
	ERROR_SAVE_DUPLICATE_SCRIPT: {
		EN: 'There was an error saving the duplicate script',
		IT: 'Si è verificato un errore durante il salvataggio dello script duplicato'
	},
	
	ERROR_GET_ORIGINAL_SCRIPT: {
		EN: 'There was an error getting the original script',
		IT: 'Si è verificato un errore durante il recupero dello script originale'
	},
	
	ERROR_EXPORT_SCRIPT: {
		EN: 'Could not retrieve the details of the script to export',
		IT: 'Impossibile recuperare i dettagli dello script da esportare'
	},
	
	ERROR_LOAD_PROFILE: {
		EN: 'Could not load the details of your profile',
		IT: 'Impossibile caricare i dettagli del tuo profilo'
	},
	
	ERROR_CHANGE_PASSWORD: {
		EN: 'Your password could not be changed because an error occurred',
		IT: 'Impossibile modificare la password perché si è verificato un errore'
	},
	
	ERROR_CHANGE_PASSWORD_INCORRECT: {		// Use %ACCOUNT% to insert reference account name
		EN: 'The current password you entered was incorrect. The password for the %ACCOUNT% account has not been changed',
		IT: 'La password corrente inserita non è corretta. La password per l\'account %ACCOUNT% non è stata modificata'
	},
	
	ERROR_SAVE_PROFILE: {
		EN: 'Your profile could not be saved because an error occurred. Your password has not been changed',
		IT: 'Impossibile salvare il profilo a causa di un errore. La tua password non è stata cambiata'
	},
	
	ERROR_GET_FILE_LIST: {
		EN: 'There was a error getting the list of files on the NAO',
		IT: 'Si è verificato un errore durante il recupero dell\'elenco dei file sul NAO'
	},
	
	ERROR_RECORDING: {
		EN: 'The NAO could not record audio because an error occurred',
		IT: 'Il NAO non è riuscito a registrare l\'audio a causa di un errore'
	},
	
	ERROR_SOUND_PLAYBACK: {
		EN: 'There was an error playing sound',
		IT: 'Si è verificato un errore durante la riproduzione del suono'
	},
	
	ERROR_DELETE_SOUND: {
		EN: 'There was an error deleting the sound',
		IT: 'Si è verificato un errore durante l\'eliminazione del suono'
	},
	
	ERROR_DELETE_FILE: {
		EN: 'There was an error deleting the file',
		IT: 'Si è verificato un errore durante l\'eliminazione del file'
	},
	
	ERROR_CLEAR_TEMP_FILES: {
		EN: 'There was an error clearing the temporary files from NAO Cadet',
		IT: 'Si è verificato un errore durante la cancellazione dei file temporanei dal cadetto NAO'
	},
	
	ERROR_RESTORE_FILE: {
		EN: 'A problem occurred trying to restore the file',
		IT: 'Si è verificato un problema durante il tentativo di ripristinare il file'
	},

	ERROR_RESTORE_SCRIPT: {
		EN: 'There was an error restoring the script',
		IT: 'Si è verificato un errore durante il ripristino dello script'
	},
	
	ERROR_RESTORE: {
		EN: 'An error occurred restoring NAO Cadet',
		IT: 'Si è verificato un errore durante il ripristino del cadetto NAO'
	},
	
	ERROR_BACKUP: {
		EN: 'An error occurred backing up NAO Cadet',
		IT: 'Si è verificato un errore durante il backup del cadetto NAO'
	},
	
	ERROR_GETTING_LOCATIONS: {
		EN: 'Could not retrieve the locations on the NAO',
		IT: 'Impossibile recuperare le posizioni sulla NAO'
	},
	
	ERROR_CREATE_LOCATION: {
		EN: 'There was an error creating the location',
		IT: 'Si è verificato un errore durante la creazione della posizione'
	},
	
	ERROR_RENAME_LOCATION: {
		EN: 'Could not rename the location because an error occurred',
		IT: 'Impossibile rinominare la posizione perché si è verificato un errore'
	},
	
	ERROR_GET_LOCATION: {
		EN: 'Could not retrieve details about the selected location',
		IT: 'Impossibile recuperare i dettagli sulla posizione selezionata'
	},
	
	ERROR_DELETE_LOCATION: {
		EN: 'An problem occurred trying to delete the location',
		IT: 'Si è verificato un problema durante il tentativo di eliminare la posizione'
	},
	
	ERROR_CREATE_LOCATION: {
		EN: 'Could not create the location on the NAO',
		IT: 'Impossibile creare la posizione sul NAO'
	},
	
	ERROR_SET_LOCATION: {
		EN: 'Could not set the location on the NAO',
		IT: 'Impossibile impostare la posizione sul NAO'
	},
	
	ERROR_RESTORE_LOCATION: {
		EN: 'An problem occurred trying to restore the location',
		IT: 'Si è verificato un problema durante il tentativo di ripristinare la posizione'
	},
	
	ERROR_RENAME_USER: {
		EN: 'An error occurred renaming the user',
		IT: 'Si è verificato un errore durante la ridenominazione dell\'utente'
	},
	
	ERROR_DELETE_USER: {
		EN: 'An problem occurred trying to delete the user',
		IT: 'Si è verificato un problema durante il tentativo di eliminare l\'utente'
	},
	
	ERROR_RESTORE_USER: {
		EN: 'An problem occurred trying to restore the user',
		IT: 'Si è verificato un problema durante il tentativo di ripristinare l\'utente'
	},
	
	ERROR_QUITTING_CADET: {
		EN: 'An problem occurred trying to quit NAO Cadet',
		IT: 'Si è verificato un problema durante il tentativo di uscire da Cadetto NAO'
	},
	
	TITLE_RESTORE_SCRIPT_ERROR: {
		EN: 'Error restoring script',
		IT: 'Errore durante il ripristino dello script'
	},
	
	TITLE_LOADING_SCRIPTS_ERROR: {
		EN: 'Error loading scripts',
		IT: 'Errore durante il caricamento degli script'
	},
	
	TITLE_ERROR_RESTORE_FILE: {
		EN: 'Error restoring file',
		IT: 'Errore durante il ripristino del file'
	},
	
	TITLE_OPTIONS: {
		EN: 'Options',
		IT: 'Opzioni'
	},
	
	TITLE_BEHAVIORS: {
		EN: 'Behaviors',
		IT: 'Comportamenti'
	},
	
	TITLE_LOAD_FILES_ERROR: {
		EN: 'Error loading files',
		IT: 'Errore durante il caricamento dei file'
	},
	
	TITLE_CLEAR_TEMP_FILES_ERROR: {
		EN: 'Clear Temp Files Error',
		IT: 'Errore file temp temporaneo'
	},
	
	TITLE_CLEAR_TEMP_FILES_SUCCESS: {
		EN: 'Clear Temp Files Success',
		IT: 'Clear Temp Files Success'
	},
	
	TITLE_SOUND_PLAYBACK_ERROR: {
		EN: 'Play sound error',
		IT: 'Riproduci errore audio'
	},
	
	TITLE_DELETE_SOUND_ERROR: {
		EN: 'Error deleting sound',
		IT: 'Errore durante l\'eliminazione dell\'audio'
	},
	
	TITLE_DELETE_FILE_ERROR: {
		EN: 'Error deleting file',
		IT: 'Errore durante l\'eliminazione del file'
	},
	
	TITLE_SAVE_PROFILE_ERROR: {
		EN: 'Save Profile Error',
		IT: 'Salva errore profilo'
	},
	
	TITLE_LOAD_PROFILE_ERROR: {
		EN: 'Load profile error',
		IT: 'Errore nel profilo di caricamento'
	},
	
	TITLE_LOADING_MOTIONS_ERROR: {
		EN: 'Error loading motions',
		IT: 'Errore durante il caricamento dei movimenti'
	},
	
	TITLE_SAVING_MOTION_ERROR: {
		EN: 'Cannot save motion',
		IT: 'Impossibile salvare il movimento'
	},
	
	TITLE_MOTION_EXISTS: {
		EN: 'Motion already exists',
		IT: 'La moto esiste già'
	},
	
	TITLE_UPLOAD_MOTION_ERROR: {
		EN: 'Motion upload error',
		IT: 'Errore di caricamento in movimento'
	},
	
	TITLE_LOADING_MOVEMENT_ERROR: {
		EN: 'Error loading movement',
		IT: 'Errore durante il caricamento del movimento'
	},
	
	TITLE_RUNNING_MOVEMENT_ERROR: {
		EN: 'Cannot run movement',
		IT: 'Impossibile eseguire il movimento'
	},
	
	TITLE_MOVE_JOINTS_ERROR: {
		EN: 'Cannot move joints',
		IT: 'Impossibile spostare le articolazioni'
	},
	
	TITLE_LOADING_SOUNDS_ERROR: {
		EN: 'Error loading sounds',
		IT: '"Errore nel caricamento dei suoni'
	},
	
	TITLE_MY_PROFILE: {
		EN: 'My Profile',
		IT: 'Il mio profilo'
	},
	
	TITLE_SCRIPTS: {
		EN: 'Scripts',
		IT: 'Script'
	},
	
	TITLE_CHANGE_PASSWORD_ERROR: {
		EN: 'Change Password Error',
		IT: 'Errore modifica password'
	},
	
	TITLE_CHANGE_PASSWORD_SUCCESS: {
		EN: 'Password changed',
		IT: 'Password modificata'
	},
	
	TITLE_CHANGE_USER_PASSWORD: {
		EN: 'Change %USERNAME% password',
		IT: 'Cambia la password %USERNAME%'
	},
	
	TITLE_LOAD_SCRIPT_ERROR: {
		EN: 'Load script error',
		IT: 'Errore caricamento script'
	},
	
	TITLE_EXPORT_SCRIPT_ERROR: {
		EN: 'Export script error',
		IT: 'Errore di script di esportazione'
	},
	
	TITLE_SCRIPT_DELETE_ERROR: {
		EN: 'Script Delete Error',
		IT: 'Errore di eliminazione script'
	},
	
	TITLE_LOADING_BEHAVIORS_ERROR: {
		EN: 'Error loading behaviors',
		IT: 'Errore durante il caricamento dei comportamenti'
	},
	
	TITLE_SAVE_SCRIPT_ERROR: {
		EN: 'Script Save Error',
		IT: 'Errore di salvataggio script'
	},
	
	TITLE_NAO_CANT_CONNECT: {
		EN: 'Could not connect to NAO',
		IT: 'Impossibile connettersi a NAO'
	},
	
	TITLE_GET_SCRIPT_ERROR: {
		EN: 'Get script error',
		IT: 'Ottieni errore di script'
	},
	
	TITLE_GET_FOLDERS_ERROR: {
		EN: 'Get folders error',
		IT: 'Errore nelle cartelle'
	},
	
	TITLE_NAO_DISCONNECTED: {
		EN: 'NAO disconnected',
		IT: 'NAO disconnesso'
	},
	
	TITLE_SET_LOCATION_ERROR: {
		EN: 'Set location error',
		IT: 'Imposta errore di posizione'
	},
	
	TITLE_NAO_CADET_SETUP: {
		EN: 'NAO Cadet Setup',
		IT: 'Installazione cadetti NAO'
	},
	
	TITLE_NAO_CADET_LOGIN: {
		EN: 'NAO Cadet Login',
		IT: 'Installazione cadetti NAO'
	},
	
	TITLE_NAO_CADET_ADMIN: {
		EN: 'NAO Cadet Admin',
		IT: 'NAO Cadet Admin'
	},
	
	TITLE_NAO_CADET_SCRIPTS: {
		EN: 'NAO Cadet Scripts',
		IT: 'Script per cadetti NAO'
	},
	
	TITLE_NAO_CADET_WORKSPACE: {
		EN: 'NAO Cadet Workspace',
		IT: 'NAO Cadet Workspace'
	},
	
	TITLE_RESTART_REQUIRED: {
		EN: 'Restart required',
		IT: 'Riavvio richiesto'
	},
	
	TITLE_NAO_CADET_SHUTDOWN: {
		EN: 'NAO Cadet has quit',
		IT: 'NAO Cadet ha smesso'
	},
	
	TITLE_NAO_BATTERY_LOW: {
		EN: 'Battery low on %NAME%',
		IT: 'Batteria scarica su %NAME%'
	},
	
	TITLE_NAO_DISK_LOW: {
		EN: 'Disk space low on %NAME%',
		IT: 'Spazio su disco insufficiente su %NAME%'
	},
	
	TITLE_SETUP: {
		EN: 'Setup',
		IT: 'Setup'
	},
	
	TITLE_SETUP_ERROR: {
		EN: 'NAO Cadet Setup Error',
		IT: 'Errore impostazione cadetto NAO'
	},
	
	TITLE_WELCOME_NAO_CADET: {
		EN: 'Welcome to NAO Cadet',
		IT: 'Welcome to NAO Cadet'
	},
	
	TITLE_NAO_ERROR: {
		EN: 'NAO Error',
		IT: 'Errore NAO'
	},
	
	TITLE_LOCATION_SETTING: {
		EN: 'Location setting',
		IT: 'Impostazione della posizione'
	},
	
	TITLE_LOCATION_ERROR: {
		EN: 'Location error',
		IT: 'Errore di posizione'
	},
	
	TITLE_RENAME_FOLDER: {
		EN: 'Rename folder',
		IT: 'Rinomina cartella'
	},
	
	TITLE_RENAME_FILE: {
		EN: 'Rename file',
		IT: 'Rinomina file'
	},
	
	TITLE_RECORD_AUDIO: {
		EN: 'Record audio',
		IT: 'Registra audio'
	},
	
	TITLE_SCRIPT_LOCKED: {
		EN: 'Script locked',
		IT: 'Script bloccato'
	},
	
	TITLE_CREATE_FOLDER: {
		EN: 'Create folder',
		IT: 'Crea cartella'
	},
	
	TITLE_DUPLICATE_SCRIPT_ERROR: {
		EN: 'Duplicate script error',
		IT: 'Errore di script duplicato'
	},
	
	TITLE_CHANGE_PASSWORD: {
		EN: 'Change Password',
		IT: 'Modifica password'
	},
	
	TITLE_SOUNDS: {
		EN: 'Sounds',
		IT: 'Sounds'
	},
	
	TITLE_PHOTOSVIDEOS: {
		EN: 'Photos/Videos',
		IT: 'Foto/Video'
	},
	
	TITLE_NAME: {
		EN: 'Name',
		IT: 'Nome'
	},
	
	TITLE_SIZE: {
		EN: 'Size',
		IT: 'Dimensione'
	},
	
	TITLE_ACTIONS: {
		EN: 'Actions',
		IT: 'Azioni'
	},
	
	TITLE_USER: {
		EN: 'User',
		IT: 'Utente'
	},
	
	TITLE_USERS: {
		EN: 'Users',
		IT: 'Utenti'
	},
	
	TITLE_FILES: {
		EN: 'Files',
		IT: 'File'
	},
	
	TITLE_DOMAIN: {
		EN: 'Domain',
		IT: 'Dominio'
	},
	
	TITLE_MOVEMENTS: {
		EN: 'Movements',
		IT: 'Movimenti'
	},
	
	TITLE_TIME: {
		EN: 'Time',
		IT: 'Tempo'
	},
	
	TITLE_UPLOAD_ERROR: {
		EN: 'Upload error',
		IT: 'Errore di caricamento'
	},
	
	TITLE_RESTORE_ERROR: {
		EN: 'Restore error',
		IT: 'Errore di ripristino'
	},
	
	TITLE_BACKUP_ERROR: {
		EN: 'Backup error',
		IT: 'Errore di backup'
	},
	
	TITLE_BACKUP_PROGRESS: {
		EN: 'Backing up...',
		IT: 'Backup in corso...'
	},
	
	TITLE_CREATE_LOCATION: {
		EN: 'Create location',
		IT: 'Crea posizione'
	},
	
	TITLE_CHANGE_LOCATION: {
		EN: 'Change Location',
		IT: 'Modifica posizione'
	},
	
	TITLE_LOCATIONS: {
		EN: 'Locations',
		IT: 'Sedi'
	},
	
	TITLE_RENAME_LOCATION: {
		EN: 'Rename Location',
		IT: 'Rinomina posizione'
	},
	
	TITLE_RENAME_LOCATION_ERROR: {
		EN: 'Rename Location Error',
		IT: 'Rinomina errore posizione'
	},
	
	TITLE_RENAME_USER: {
		EN: 'Rename user',
		IT: 'Rinomina utente'
	},
	
	TITLE_GET_LOCATION_ERROR: {
		EN: 'Get location error',
		IT: 'Ottieni errore di posizione'
	},
	
	TITLE_DELETE_LOCATION_ERROR: {
		EN: 'Error deleting location',
		IT: 'Errore durante l\'eliminazione della posizione'
	},
	
	TITLE_RESTORE_LOCATION_ERROR: {
		EN: 'Error restoring location',
		IT: 'Errore durante il ripristino della posizione'
	},
	
	TITLE_JOINT_INFORMATION: {
		EN: 'Joint Information',
		IT: 'Informazioni congiunte'
	},
	
	TITLE_SET_JOINTS: {
		EN: 'Set Joints',
		IT: 'Imposta giunti'
	},
	
	TITLE_ABOUT: {
		EN: 'About NAO Cadet',
		IT: 'Informazioni sul cadetto NAO'
	},
	
	TITLE_MOTIONS: {
		EN: 'Motions',
		IT: 'Proposte'
	},
	
	TITLE_CREATE_MOTION: {
		EN: 'Create motion',
		IT: 'Crea movimento'
	},
	
	MSG_NEW_FOLDER: {
		EN: 'New folder',
		IT: 'Nuova cartella'
	},
	
	MSG_NEW_PASSWORD: {
		EN: 'New Password',
		IT: 'Nuova password'
	},
	
	MSG_NEW_PASSWORD_AGAIN: {
		EN: 'New password (again)',
		IT: 'Nuova password (di nuovo)'
	},
	
	MSG_LEAVE_BLANK_PASSWORD: {
		EN: 'Leave blank unless you want to change your password',
		IT: 'Lascia vuoto se non desideri modificare la password'
	},
	
	MSG_PASSWORD_CHANGED: {		// Use %ACCOUNT% to insert reference account name
		EN: 'The password for the %ACCOUNT% account has been changed',
		IT: 'La password per l\'account %ACCOUNT% è stata modificata'
	},
	
	MSG_SCRIPT_LOCKED: {
		EN: 'This script is locked because it was created by someone else or is currently being edited.<br><br>You are able to view this script however you will need to save it as a copy',
		IT: 'Questo script è bloccato perché è stato creato da qualcun altro o è attualmente in fase di modifica. <br> <br> Puoi visualizzare questo script, tuttavia dovrai salvarlo come copia'
	},

	MSG_RESTART_REQUIRED: {
		EN: 'There has been a system change with %NAME% and a restart of NAO Cadet is required',
		IT: 'Si è verificato un cambiamento di sistema con %NAME% ed è necessario il riavvio di Cadet NAO'
	},
	
	MSG_NAO_CADET_SHUTDOWN: {
		EN: 'NAO Cadet has quit on %NAME%. Thanks for playing!',
		IT: 'NAO Cadet ha abbandonato %NAME%. Grazie per aver giocato!'
	},
	
	MSG_NAO_BATTERY_LOW: {
		EN: '%NAME% is running low on charge. You may need to connect %NAME% to power soon',
		IT: '%NAME% sta per esaurirsi. Potrebbe essere necessario connettere %NAME% per alimentare presto'
	},
	
	MSG_NAO_DISK_LOW: {
		EN: '%NAME% is running low on storage. An administrator may need to remove sounds/videos from NAO Cadet or programs from Choregraphe',
		IT: '%NAME% sta esaurendo lo spazio di archiviazione. Potrebbe essere necessario che un amministratore rimuova suoni/video dal cadetto NAO o programmi da Choregraphe'
	},
	
	MSG_WELCOME_NAO_CADET: {
		EN: '%TIME_GREETING%, It\'s great to be in %LOCATION%<br><br>Before we start, what is your name?',
		IT: '%TIME_GREETING%, è bello essere in %LOCATION% <br> <br> Prima di iniziare, come ti chiami?'
	},
	
	MSG_CLEAR_TEMP_FILES_SUCCESS: {
		EN: 'Temporary files have been cleared successfully',
		IT: 'I file temporanei sono stati cancellati correttamente'
	},
	
	MSG_UNEXPECTED_DISCONNECT: {
		EN: '%NAME% has unexpectedly disconnected from us. There maybe a network issue or the NAO may need to be restarted.',
		IT: '%NAME% si è inaspettatamente disconnesso da noi. Potrebbe esserci un problema di rete o potrebbe essere necessario riavviare il NAO.'
	},
	
	MSG_PAGE_NOT_FOUND: {
		EN: 'Page %1% not found',
		IT: 'Pagina %1% non trovata'
	},
	
	MSG_UPLOADING_FILE: {
		EN: 'Uploading File',
		IT: 'Caricamento file'
	},
	
	MSG_PASSWORD_REQUIRED: {
		EN: 'Password required',
		IT: 'Password obbligatoria'
	},
	
	MSG_SCRIPT_COUNT: {
		EN: '%1% script(s)',
		IT: '%1% script(s)'
	},
	
	MSG_SCRIPT_TOTAL: {
		EN: '%1% script(s) [%2% total]',
		IT: '%1% sceneggiatura [%2% totale]'
	},
	
	MSG_GOOD_MORNING: {
		EN: 'Good morning',
		IT: 'Buongiorno'
	},
	
	MSG_GOOD_AFTERNOON: {
		EN: 'Good afternoon',
		IT: 'Buon pomeriggio'
	},
	
	MSG_GOOD_EVENING: {
		EN: 'Good evening',
		IT: 'Buonasera'
	},
	
	MSG_LOADING_NAO_CADET: {
		EN: 'Loading NAO Cadet...',
		IT: 'Caricamento cadetto NAO...'
	},
	
	MSG_CONNECTING_TO_NAO: {
		EN: 'Connecting to NAO...',
		IT: 'Connessione a NAO...'
	},
	
	MSG_ERROR_CODE: {
		EN: 'Error code',
		IT: 'Codice errore'
	},
	
	MSG_FIRST_TIME: {
		EN: 'We\'ve noticed that this is the first time NAO Cadet has been run on %NAME%, and we need the following information before we continue:',
		IT: 'Abbiamo notato che questa è la prima volta che cado NAO è stato eseguito su %NAME% e abbiamo bisogno delle seguenti informazioni prima di continuare:'
	},
	
	MSG_FIRST_TIME_LOCATION_INFO: {
		EN: 'NAO Cadet identifies users and scripts per location. If %NAME% moves to a different location, it will not affect the users and scripts at this location.<br><br>Users will be able to view scripts at other locations, but not modify them',
		IT: 'NAO Cadet identifica gli utenti e gli script per posizione. Se %NAME% si sposta in una posizione diversa, ciò non influirà sugli utenti e sugli script in questa posizione. <br> <br> Gli utenti potranno visualizzare gli script in altre posizioni, ma non modificarli'
	},
	
	MSG_SAVE_SCRIPT_CONFIRM: {
		EN: 'Do you want to save the changes to your script?',
		IT: 'Vuoi salvare le modifiche al tuo script?'
	},
	
	MSG_LOCATION: {
		EN: 'Location',
		IT: 'Posizione'
	},
	
	MSG_CURRENT_PASSWORD: {
		EN: 'Current password',
		IT: 'Password corrente'
	},
	
	MSG_ADMIN_PASSWORD: {
		EN: 'Admin password',
		IT: 'Password amministratore'
	},
	
	MSG_ADMIN_PASSWORD_INFO: {
		EN: 'The admin account is used to modify NAO Cadet settings and perform bulk activities',
		IT: 'L\'account amministratore viene utilizzato per modificare le impostazioni del cadetto NAO ed eseguire attività in blocco'
	},
	
	MSG_ROOT_PASSWORD: {
		EN: 'Root password',
		IT: 'Password di root'
	},
	
	MSG_ROOT_PASSWORD_INFO: {
		EN: 'The <strong>root</strong> account is used as an emergency account and can permanently delete data',
		IT: 'L\'account <strong> root </strong> viene utilizzato come account di emergenza e può eliminare definitivamente i dati'
	},
	
	MSG_ENTER_PASSWORD: {
		EN: 'Enter your password to login',
		IT: 'Inserisci la password per accedere'
	},
	
	MSG_SET_LOCATION_TO_SAVE: {
		EN: 'You need to select a valid location before it can be saved',
		IT: 'Devi selezionare un percorso valido prima che possa essere salvato'
	},
	
	MSG_NAME: {
		EN: 'Name',
		IT: 'Nome'
	},
	
	MSG_PASSWORD: {
		EN: 'Password',
		IT: 'Password'
	},
	
	MSG_LOCATION_SETTING: {
		EN: 'This NAO is currently set for the location %LOCATION% and will default to the scripts and users at %LOCATION%.<br><br>If this is not correct and you would like to change this, login using the <i>admin</i> account and select <i>Change Location</i>',
		IT: 'Questo NAO è attualmente impostato per la posizione %LOCATION% e imposterà automaticamente gli script e gli utenti su %LOCATION%. <br> <br> Se questo non è corretto e si desidera modificarlo, accedere utilizzando < i> admin </i> e selezionare <i> Cambia posizione </i>'
	},
	
	MSG_CONFIRM_QUIT_CADET: {
		EN: 'Are you sure you want to quit NAO Cadet for all users?',
		IT: 'Sei sicuro di voler uscire da NAO Cadet per tutti gli utenti?'
	},
	
	MSG_RENAME: {
		EN: 'Rename',
		IT: 'Rinomina'
	},
	
	MSG_CREATED_BY: {
		EN: 'Created by',
		IT: 'Creato da'
	},
	
	MSG_NO_SCRIPTS_FOUND: {
		EN: 'No scripts found',
		IT: 'Nessuno script trovato'
	},
	
	MSG_SCRIPT: {
		EN: 'Script',
		IT: 'Script'
	},
	
	MSG_COPY: {
		EN: 'copy',
		IT: 'copia'
	},
	
	MSG_FOLDER: {
		EN: 'Folder',
		IT: 'Cartella'
	},
	
	MSG_HOME: {
		EN: 'Home',
		IT: 'Casa'
	},
	
	MSG_OTHER: {
		EN: 'Other',
		IT: 'Altro'
	},
	
	MSG_COLOUR: {
		EN: 'Colour',
		IT: 'Colore'
	},
	
	MSG_COLOUR_AQUA: {
		EN: 'Aqua',
		IT: 'Aqua'
	},
	
	MSG_COLOUR_Blue: {
		EN: 'Blue',
		IT: 'Blu'
	},
	
	MSG_COLOUR_GREEN: {
		EN: 'Green',
		IT: 'Verde'
	},
	
	MSG_COLOUR_GREY: {
		EN: 'Grey',
		IT: 'Gray'
	},
	
	MSG_COLOUR_ORANGE: {
		EN: 'Orange',
		IT: 'Orange'
	},
	
	MSG_COLOUR_RED: {
		EN: 'Red',
		IT: 'Rosso'
	},

	MSG_ICON: {
		EN: 'Icon',
		IT: 'Icona'
	},
	
	MSG_CREATE_SCRIPT: {
		EN: 'Create script',
		IT: 'Crea script'
	},
	
	MSG_EDIT_SCRIPT: {
		EN: 'Edit script',
		IT: 'Modifica script'
	},
	
	MSG_CONFIRM_DELETE_SCRIPT: {
		EN: 'Are you sure you want to delete this script?',
		IT: 'Sei sicuro di voler eliminare questo script?'
	},
	
	MSG_CONFIRM_DELETE_SOUND: {
		EN: 'Are you sure you want to delete this sound?',
		IT: 'Sei sicuro di voler eliminare questo suono?'
	},
	
	MSG_CONFIRM_DELETE_FILE: {
		EN: 'Are you sure you want to delete this file?',
		IT: 'Sei sicuro di voler eliminare questo file?'
	},
	
	MSG_CONFIRM_DELETE_LOCATION: {
		EN: 'Are you sure you want to delete this location?',
		IT: 'Sei sicuro di voler cancellare questa posizione?'
	},
	
	MSG_CONFIRM_DELETE_USER: {
		EN: 'Are you sure you want to delete this user?',
		IT: 'Sei sicuro di voler eliminare questo utente?'
	},
	
	MSG_CONFIRM_DELETE_MOTION: {
		EN: 'Are you sure you want to delete this motion?',
		IT: 'Sei sicuro di voler eliminare questo movimento?'
	},
	
	MSG_NO_PASSWORD_SET: {
		EN: 'No password has been set',
		IT: 'Nessuna password è stata impostata'
	},
	
	MSG_SCRIPT_SAVED: {
		EN: 'Script saved!',
		IT: 'Script salvato!'
	},
	
	MSG_SOUND_ADDED: {
		EN: 'Sound added!',
		IT: 'Aggiunto suono!'
	},
	
	MSG_BEHAVIOR_ADDED: {
		EN: 'Behavior added!',
		IT: 'Comportamento aggiunto!'
	},
	
	MSG_MOTION_ADDED: {
		EN: 'Motion added!',
		IT: 'Motion aggiunto!'
	},
	
	MSG_SAVE_SCRIPT_AS: {
		EN: 'Save script as',
		IT: 'Salva script con nome'
	},
	
	MSG_RECORDING_NAME: {
		EN: 'Recording name',
		IT: 'Nome registrazione'
	},
	
	MSG_MY_RECORDING: {
		EN: 'My recording',
		IT: 'La mia registrazione'
	},
	
	MSG_WARNING: {
		EN: 'Warning',
		IT: 'Avvertenza'
	},
	
	MSG_CHANGE_DISCONNECT_USERS: {
		EN: 'Changing this setting will force all connected users to be disconnected',
		IT: 'La modifica di questa impostazione forzerà la disconnessione di tutti gli utenti connessi'
	},
	
	MSG_LOCATION_SET_TO: {
		EN: 'Location set to',
		IT: 'Posizione impostata su'
	},
	
	MSG_COLOUR_SET_TO: {
		EN: 'Colour set to',
		IT: 'Colore impostato su'
	},
	
	MSG_BACKUP_RESTORE: {
		EN: 'Backup / Restore',
		IT: 'Di Riserva / Ristabilire'
	},
	
	MSG_USERS: {
		EN: 'Users',
		IT: 'Utenti'
	},
	
	MSG_SCRIPTS: {
		EN: 'Scripts',
		IT: 'Script'
	},
	
	MSG_FILES: {
		EN: 'Files',
		IT: 'File'
	},
	
	MSG_CHANGE_ADMIN_PASSWORD: {
		EN: 'Change Admin Password',
		IT: 'Cambia password amministratore'
	},
	
	MSG_CHANGE_ROOT_PASSWORD: {
		EN: 'Change Root Password',
		IT: 'Cambia password di root'
	},
	
	MSG_HEAD: {
		EN: 'Head',
		IT: 'Testa'
	},
	
	MSG_LEFT_ARM: {
		EN: 'Left Arm',
		IT: 'Braccio sinistro'
	},
	
	MSG_RIGHT_ARM: {
		EN: 'Right Arm',
		IT: 'Braccio destro'
	},
	
	MSG_LEFT: {
		EN: 'Left',
		IT: 'Sinistra'
	},
	
	MSG_RIGHT: {
		EN: 'Right',
		IT: 'Destro'
	},
	
	MSG_SPEED: {
		EN: 'Speed',
		IT: 'Tempo'
	},
	
	MSG_ACTION: {
		EN: 'Action',
		IT: 'Azione'
	},
	
	MSG_NO_MOVEMENTS_FOUND: {
		EN: 'No movements found',
		IT: 'Nessun movimento trovato'
	},
	
	MSG_HEAD: {
		EN: 'Head',
		IT: 'Testa'
	},
	
	MSG_SHOULDER: {
		EN: 'Shoulder',
		IT: 'Spalla'
	},
	
	MSG_ELBOW: {
		EN: 'Elbow',
		IT: 'Gomito'
	},
	
	MSG_WRIST: {
		EN: 'Wrist',
		IT: 'Polso'
	},
	
	MSG_PITCH: {
		EN: 'Pitch',
		IT: 'Intonazione'
	},
	
	MSG_YAW: {
		EN: 'Yaw',
		IT: 'Straorzata'
	},
	
	MSG_ROLL: {
		EN: 'Roll',
		IT: 'Rotolo'
	},
	
	MSG_DELAY: {
		EN: 'Delay',
		IT: 'Ritardo'
	},
	
	BTN_OK: {
		EN: 'OK',
		IT: 'OK'
	},
	
	BTN_CANCEL: {
		EN: 'Cancel',
		IT: 'Annulla'
	},
	
	BTN_QUIT: {
		EN: 'Quit NAO Cadet',
		IT: 'Esci dal cadetto NAO'
	},
	
	BTN_ADD: {
		EN: 'Add',
		IT: 'Inserisci'
	},
	
	BTN_RECONNECT: {
		EN: 'Reconnect',
		IT: 'Riconnetti'
	},
	
	BTN_CLOSE: {
		EN: 'Close',
		IT: 'Vicino'
	},
	
	BTN_CLEAR_SEARCH: {
		EN: 'Clear Search',
		IT: 'Cancella ricerca'
	},
	
	BTN_RESTART: {
		EN: 'Restart',
		IT: 'Riavvia'
	},
	
	BTN_SAVE: {
		EN: 'Save',
		IT: 'Salva'
	},
	
	BTN_LETS_GO: {
		EN: 'Lets Go',
		IT: 'Lets Go'
	},
	
	BTN_BACK: {
		EN: 'Back',
		IT: 'Indietro'
	},
	
	BTN_LOGIN: {
		EN: 'Login',
		IT: 'Login'
	},
	
	BTN_CREATE: {
		EN: 'Create',
		IT: 'Crea'
	},
	
	BTN_CREATE_MORE: {
		EN: 'Create...',
		IT: 'Crea...'
	},
	
	BTN_HOME: {
		EN: 'Home',
		IT: 'Casa'
	},
	
	BTN_SAVE: {
		EN: 'Save',
		IT: 'Salva'
	},
	
	BTN_SAVE_AS: {
		EN: 'Save As',
		IT: 'Salva con nome'
	},
	
	BTN_YES: {
		EN: 'Yes',
		IT: 'Sì'
	},
	
	BTN_NO: {
		EN: 'No',
		IT: 'No'
	},
	
	BTN_SHOW_ADVANCED_BLOCKS: {
		EN: 'Show advanced blocks',
		IT: 'Mostra blocchi avanzati'
	},
	
	BTN_VERIFY: {
		EN: 'Verify',
		IT: 'Verifica'
	},
	
	BTN_REMOVE_PASSWORD: {
		EN: 'Remove Password',
		IT: 'Rimuovi password'
	},
	
	BTN_STOP: {
		EN: 'Stop',
		IT: 'Stop'
	},
	
	BTN_RUN: {
		EN: 'Run',
		IT: 'Esegui'
	},
	
	BTN_UPLOAD: {
		EN: 'Upload...',
		IT: 'Upload...'
	},
	
	BTN_RECORD: {
		EN: 'Record',
		IT: 'Record'
	},
	
	BTN_CHANGE_LOCATION: {
		EN: 'Change Location',
		IT: 'Cambia posizione'
	},
	
	BTN_VIEW_LOCATIONS: {
		EN: 'View Locations',
		IT: 'Visualizza posizioni'
	},
	
	BTN_CHANGE_COLOUR: {
		EN: 'Change Colour',
		IT: 'Cambia colore'
	},
	
	BTN_BACKUP: {
		EN: 'Backup',
		IT: 'Di Riserva'
	},
	
	BTN_RESTORE: {
		EN: 'Restore',
		IT: 'Ristabilire'
	},
	
	BTN_VIEW_USERS: {
		EN: 'View Users',
		IT: 'Visualizza utenti'
	},
	
	BTN_VIEW_SCRIPTS: {
		EN: 'View Scripts',
		IT: 'Visualizza script'
	},
	
	BTN_VIEW_FILES: {
		EN: 'View Files',
		IT: 'Vedi files'
	},
	
	BTN_CLEAR_TEMP_FILES: {
		EN: 'Clear Temp Files',
		IT: 'Cancella file temporanei'
	},
	
	BTN_CHANGE_PASSWORD: {
		EN: 'Change Password',
		IT: 'Cambia la password'
	},
	
	BTN_RENAME: {
		EN: 'Rename',
		IT: 'Rinominare'
	},
	
	MENU_UPLOAD_SCRIPT: {
		EN: 'Upload Script',
		IT: 'Carica script'
	},
	
	MENU_MY_SCRIPTS: {
		EN: 'My scripts',
		IT: 'I miei script'
	},
	
	MENU_ALL_SCRIPTS: {
		EN: 'All scripts',
		IT: 'Tutti gli script'
	},
	
	MENU_EXPORT_SCRIPT: {
		EN: 'Export script',
		IT: 'Export script'
	},
	
	MENU_SHOW_EMPTY: {
		EN: 'Show empty folders',
		IT: 'Mostra cartelle vuote'
	},
	
	MENU_SOUNDS: {
		EN: 'Sounds',
		IT: 'Sounds'
	},
	
	MENU_PHOTOSVIDEOS: {
		EN: 'Photos/Videos',
		IT: 'Foto/Videos'
	},
	
	MENU_BEHAVIORS: {
		EN: 'Behaviors',
		IT: 'Behaviors'
	},
	
	MENU_MOTIONS: {
		EN: 'Motions',
		IT: 'Mozioni'
	},
	
	MENU_MY_PROFILE: {
		EN: 'My profile',
		IT: 'Il mio profilo'
	},
	
	MENU_LOGOUT: {
		EN: 'Logout',
		IT: 'Logout'
	},
	
	ITEM_LOCATION: {
		EN: 'location',
		IT: 'posizione'
	},
	
	ITEM_USER: {
		EN: 'user',
		IT: 'utente'
	},
	
	ITEM_SCRIPT: {
		EN: 'script',
		IT: 'copione'
	},
	
	ITEM_FILE: {
		EN: 'file',
		IT: 'file'
	},
	
	ITEM_SOUND: {
		EN: 'sound',
		IT: 'suono'
	},
	
	ITEM_BEHAVIOR: {
		EN: 'behavior',
		IT: 'comportamento'
	},
	
	ITEM_MOTION: {
		EN: 'motion',
		IT: 'movimento'
	},
	
	CATEGORY_EVENTS: {
		EN: 'Events',
		IT: 'Eventi'
	},
	
	CATEGORY_EVENTS_LABEL_EVENTS: {
		EN: 'Events',
		IT: 'Eventi'
	},
	
	CATEGORY_MOTION: {
		EN: 'Motion',
		IT: 'Movimento'
	},
	
	CATEGORY_MOTION_LABEL_MOVE: {
		EN: 'Move',
		IT: 'Mossa'
	},
	
	CATEGORY_MOTION_LABEL_MOTION: {
		EN: 'Motion',
		IT: 'Movimento'
	},
	
	CATEGORY_MOTION_BUTTON_JOINTBUILDER: {
		EN: 'Joint Builder',
		IT: 'Costruttore Congiunto'
	},
	
	CATEGORY_MOTION_BUTTON_VIEWMOTIONS: {
		EN: 'View Motions',
		IT: 'Visualizza Movimenti'
	},
	
	CATEGORY_MOTION_LABEL_BEHAVIOR: {
		EN: 'Behavior',
		IT: 'Comportamento'
	},
	
	CATEGORY_MOTION_BUTTON_VIEWBEHAVIORS: {
		EN: 'View Behaviors',
		IT: 'Visualizza i comportamenti'
	},
	
	CATEGORY_SOUNDS: {
		EN: 'Sounds',
		IT: 'Suoni'
	},
	
	CATEGORY_SOUNDS_LABEL_SPEECH: {
		EN: 'Speech',
		IT: 'Discorso'
	},
	
	CATEGORY_SOUNDS_LABEL_SOUND: {
		EN: 'Sound',
		IT: 'Suono'
	},
	
	CATEGORY_SOUNDS_BUTTON_VIEWSOUNDS: {
		EN: 'View Sounds',
		IT: 'Visualizza Suoni'
	},
	
	CATEGORY_SOUNDS_LABEL_RECORD: {
		EN: 'Record',
		IT: 'Disco'
	},
	
	CATEGORY_SOUNDS_LABEL_VOLUME: {
		EN: 'Volume',
		IT: 'Volume'
	},
	
	CATEGORY_LOOKS: {
		EN: 'Looks',
		IT: 'Sembra'
	},

	CATEGORY_LOOKS_LABEL_LEDS: {
		EN: 'LEDs',
		IT: 'LEDs'
	},
		
	CATEGORY_LOOKS_LABEL_PHOTOS: {
		EN: 'Photos',
		IT: 'Foto'
	},
		
	CATEGORY_LOOKS_LABEL_VIDEO: {
		EN: 'Video',
		IT: 'Video'
	},
		
	CATEGORY_LOOKS_LABEL_COLOURS: {
		EN: 'Colours',
		IT: 'Colori'
	},
		
	CATEGORY_LOOPS: {
		EN: 'Loops',
		IT: 'Loops'
	},
	
	CATEGORY_LOOPS_LABEL_LOOPS: {
		EN: 'Loops',
		IT: 'Loops'
	},
		
	CATEGORY_LOOPS_LABEL_END: {
		EN: 'End',
		IT: 'End'
	},
		
	CATEGORY_LOGIC: {
		EN: 'Logic',
		IT: 'Logica'
	},
	
	CATEGORY_LOGIC_LABEL_LOGIC	: {
		EN: 'Logic',
		IT: 'Logica'
	},
		
	CATEGORY_NUMBERS: {
		EN: 'Numbers',
		IT: 'Numbers'
	},
	
	CATEGORY_NUMBERS_LABEL_NUMBERS: {
		EN: 'Numbers',
		IT: 'Numbers'
	},
		
	CATEGORY_TEXT: {
		EN: 'Text',
		IT: 'Testo'
	},
	
	CATEGORY_TEXT_LABEL_TEXT: {
		EN: 'Text',
		IT: 'Testo'
	},
		
	CATEGORY_LISTS: {
		EN: 'Lists',
		IT: 'Elenchi'
	},
	
	CATEGORY_LISTS_LABEL_LISTS: {
		EN: 'Lists',
		IT: 'Elenchi'
	},
		
	CATEGORY_LISTS_LABEL_FILES: {
		EN: 'Files',
		IT: 'Files'
	},
		
	CATEGORY_VARIABLES: {
		EN: 'Variables',
		IT: 'Variabili'
	},
	
	CATEGORY_FUNCTIONS: {
		EN: 'Functions',
		IT: 'Funzioni'
	},
	
	BLOCK_NAO_EVENT_RUN: {
		EN: 'when run',
		IT: 'when run'
	},
	
	BLOCK_NAO_EVENT_BUMPER_LEFT: {
		EN: 'when left foot pressed',
		IT: 'quando il piede sinistro è premuto'
	},
	
	BLOCK_NAO_EVENT_BUMPER_RIGHT: {
		EN: 'when right foot pressed',
		IT: 'quando il piede destro è premuto'
	},
	
	BLOCK_NAO_EVENT_HAND_LEFT: {
		EN: 'when left hand pressed',
		IT: 'quando viene premuta la mano sinistra'
	},
	
	BLOCK_NAO_EVENT_HAND_RIGHT: {
		EN: 'when right hand pressed',
		IT: 'quando si preme la mano destra'
	},
	
	BLOCK_NAO_EVENT_HEAD_FRONT: {
		EN: 'when head front pressed',
		IT: 'quando si preme la parte anteriore della testa'
	},
	
	BLOCK_NAO_EVENT_HEAD_MIDDLE: {
		EN: 'when head middle pressed',
		IT: 'quando la testa viene premuta al centro'
	},
	
	BLOCK_NAO_EVENT_HEAD_REAR: {
		EN: 'when head back pressed',
		IT: 'quando si preme la testa indietro'
	},
	
	BLOCK_NAO_TOUCHSTATE: {
		EN: '%1 pressed',
		IT: '%1 premuto'
	},
	
	BLOCK_NAO_EVENT_TIMER: {
		EN: 'on %1 seconds',
		IT: 'on %1 secondi'
	},
	
	BLOCK_NAO_EVENT_BLOCK: {
		EN: '%1 events',
		IT: '%1 eventi'
	},
	
	BLOCK_NAO_EVENT_IGNORE: {
		EN: 'ignoring events',
		IT: 'ignorando gli eventi'
	},
	
	BLOCK_MOTION_MOVE_STEPS: {
		EN: 'move %1 steps',
		IT: 'sposta %1 passi'
	},
	
	BLOCK_MOTION_TURN_LEFTRIGHT: {
		EN: 'turn %1',
		IT: 'turn %1'
	},
	
	BLOCK_MOTION_STEP_LEFTRIGHT: {
		EN: 'step %1',
		IT: 'step %1'
	},
	
	BLOCK_MOTION_OPENCLOSE_HAND: {
		EN: '%1 %2 hand',
		IT: '%1 %2 lancette'
	},
	
	BLOCK_MOTION_WAKEUP: {
		EN: 'wake up',
		IT: 'sveglia'
	},
	
	BLOCK_MOTION_REST: {
		EN: 'rest',
		IT: 'riposo'
	},
	
	BLOCK_ROBOTPOSTURE_SITTING: {
		EN: 'sit down',
		IT: 'siediti'
	},
	
	BLOCK_ROBOTPOSTURE_STANDING: {
		EN: 'stand up',
		IT: 'alzati'
	},
	
	BLOCK_MOTION_SETHEAD: {
		EN: 'set head %1 to %2 degrees',
		IT: 'imposta la testa da %1 a %2 gradi'
	},
	
	BLOCK_MOTION_SETHAND: {
		EN: 'set %1 hand to %2 degrees',
		IT: 'imposta la mano %1 su %2 gradi'
	},
	
	BLOCK_MOTION_SETJOINT: {
		EN: 'set %1 %2 %3 to %4 degrees',
		IT: 'imposta %1 %2 %3 su %4 gradi'
	},
	
	BLOCK_MOTION_SETJOINTALL: {
		EN: 'set joints %1 to angles %2 speed %3',
		IT: 'imposta i giunti %1 sugli angoli %2 velocità %3'
	},
	
	BLOCK_MOTION_RUN_DROPDOWN: {
		EN: 'run motion %1',
		IT: 'run motion %1'
	},
	
	BLOCK_ANIMATEDSPEECH_SAY: {
		EN: 'say %1',
		IT: 'dire %1'
	},
	
	BLOCK_TEXTTOSPEECH_SAY: {
		EN: 'say %1 %2 wait %3 animated',
		IT: 'dire %1 %2 attendere %3 animato'
	},
	
	BLOCK_TEXTTOSPEECH_WAIT: {
		EN: 'wait until speech done',
		IT: 'aspetta il discorso'
	},
	
	BLOCK_TEXTTOSPEECH_DONE: {
		EN: 'speech done',
		IT: 'discorso fatto'
	},
	
	BLOCK_AUDIOPLAYER_PLAYSINE: {
		EN: 'play frequency %1hz gain %2 for %3 seconds',
		IT: 'frequenza di riproduzione %1hz guadagno %2 per %3 secondi'
	},
	
	BLOCK_AUDIOPLAYER_STOPALL: {
		EN: 'stop all sounds',
		IT: 'ferma tutti i suoni'
	},
	
	BLOCK_AUDIOPLAYER_WAIT: {
		EN: 'wait for sound to finish',
		IT: 'aspetta che il suono finisca'
	},
	
	BLOCK_AUDIODEVICE_SETOUTPUTVOLUME: {
		EN: 'set volume %1',
		IT: 'imposta volume %1'
	},
	
	BLOCK_AUDIODEVICE_GETOUTPUTVOLUME: {
		EN: 'get volume',
		IT: 'ottieni volume'
	},
	
	BLOCK_AUDIODEVICE_MUTE: {
		EN: 'mute volume',
		IT: 'volume muto'
	},
	
	BLOCK_AUDIODEVICE_UNMUTE: {
		EN: 'unmute volume',
		IT: 'unmute volume'
	},
	
	BLOCK_AUDIODEVICE_STARTMICROPHONESRECORDING: {
		EN: 'start recording %1',
		IT: 'avvia la registrazione %1'
	},
	
	BLOCK_AUDIODEVICE_STOPMICROPHONESRECORDING: {
		EN: 'stop recording',
		IT: '"stop recording'
	},
	
	BLOCK_AUDIOPLAYER_PLAYFILE_DROPDOWN: {
		EN: 'play sound %1 %2 wait',
		IT: 'riproduci suono %1 %2 aspetta'
	},
	
	BLOCK_AUDIOPLAYER_PLAYFILESTRING: {
		EN: 'play sound %1 %2 wait',
		IT: 'riproduci suono %1 %2 aspetta'
	},
	
	BLOCK_LEDS_RANDOM_EYES: {
		EN: 'random eyes for %1 seconds',
		IT: 'occhi casuali per %1 secondi'
	},
	
	BLOCK_LEDS_COLOUR: {
		EN: 'led %1 colour %2',
		IT: 'led %1 color %2'
	},
	
	BLOCK_BEHAVIOR_RUN: {
		EN: 'do behavior %1 %2 wait',
		IT: 'do behavior %1 %2 wait'
	},
	
	BLOCK_BEHAVIOR_RUNNING: {
		EN: 'behavior %1 running',
		IT: 'comportamento %1 in esecuzione'
	},
	
	BLOCK_PHOTO_CAPTURE: {
		EN: 'take photo %1',
		IT: 'scatta foto %1'
	},
	
	BLOCK_VIDEO_STARTRECORDING: {
		EN: 'record video %1',
		IT: 'registra video %1'
	},
	
	BLOCK_VIDEO_STOPRECORDING: {
		EN: 'stop video recording',
		IT: 'stop registrazione video'
	},
	
	BLOCK_EXIT_EVENT: {
		EN: 'end stack',
		IT: 'end stack'
	},
	
	BLOCK_END_SCRIPT: {
		EN: 'end script',
		IT: 'end script'
	},
	
	BLOCK_WAIT: {
		EN: 'wait %1 seconds',
		IT: 'wait %1 secondi'
	},
	
	BLOCK_NAO_MSEC: {
		EN: 'milliseconds since active',
		IT: 'millisecondi dal momento che attivo'
	},
	
	BLOCK_SYSTEM_USERNAME: {
		EN: 'my username',
		IT: 'il mio nome utente'
	},
	
	BLOCK_SYSTEM_ROBOTNAME: {
		EN: 'nao name',
		IT: '"nao name'
	},
	
	BLOCK_SCRIPT_ALERT: {
		EN: 'script alert %1',
		IT: 'script alert %1'
	},
	
	BLOCK_SCRIPT_ASK: {
		EN: 'script ask for %1 with message %2',
		IT: 'script chiede %1 con messaggio %2'
	},
	
	BLOCK_COMMENT: {
		EN: 'comment %1',
		IT: 'commento %1'
	},
	
	BLOCK_FILE_LIST: {
		EN: 'file list',
		IT: 'elenco file'
	},
	
	BLOCK_FILE_EXISTS: {
		EN: 'file %1 exists',
		IT: 'il file %1 esiste'
	},
	
	BLOCK_OPTION_LEFT: {
		EN: 'left',
		IT: 'sinistra'
	},
	
	BLOCK_OPTION_RIGHT: {
		EN: 'right',
		IT: 'destra'
	},
	
	BLOCK_OPTION_SHOULDER: {
		EN: 'shoulder',
		IT: 'spalla'
	},
	
	BLOCK_OPTION_ELBOW: {
		EN: 'elbow',
		IT: 'gomito'
	},
	
	BLOCK_OPTION_WRIST: {
		EN: 'wrist',
		IT: 'polso'
	},
	
	BLOCK_OPTION_HAND: {
		EN: 'hand',
		IT: 'mano'
	},
	
	BLOCK_OPTION_ANKLE: {
		EN: 'ankle',
		IT: 'caviglia'
	},
	
	BLOCK_OPTION_HIP: {
		EN: 'hip',
		IT: 'anca'
	},
	
	BLOCK_OPTION_KNEE: {
		EN: 'knee',
		IT: 'ginocchio'
	},
	
	BLOCK_OPTION_PITCH: {
		EN: 'pitch',
		IT: 'pitch'
	},
	
	BLOCK_OPTION_YAW: {
		EN: 'yaw',
		IT: 'imbardata'
	},
	
	BLOCK_OPTION_YAW_PITCH: {
		EN: 'yaw pitch',
		IT: 'imbardata pitch'
	},
	
	BLOCK_OPTION_ROLL: {
		EN: 'roll',
		IT: 'roll'
	},
	
	BLOCK_OPTION_LEFT_FOOT: {
		EN: 'left foot',
		IT: 'piede sinistro'
	},
	
	BLOCK_OPTION_RIGHT_FOOT: {
		EN: 'right foot',
		IT: 'piede destro'
	},
	
	BLOCK_OPTION_LEFT_HAND: {
		EN: 'left hand',
		IT: 'mano sinistra'
	},
	
	BLOCK_OPTION_RIGHT_HAND: {
		EN: 'right hand',
		IT: 'mano destra'
	},
	
	BLOCK_OPTION_HEAD_FRONT: {
		EN: 'head front',
		IT: 'head front'
	},
	
	BLOCK_OPTION_HEAD_MIDDLE: {
		EN: 'head middle',
		IT: 'head middle'
	},
	
	BLOCK_OPTION_HEAD_BACK: {
		EN: 'head back',
		IT: 'testa indietro'
	},
	
	BLOCK_OPTION_TEXT: {
		EN: 'text',
		IT: 'testo'
	},
	
	BLOCK_OPTION_NUMBER: {
		EN: 'number',
		IT: 'numero'
	},
	
	BLOCK_OPTION_WAIT: {
		EN: 'wait',
		IT: 'wait'
	},
	
	BLOCK_OPTION_ENTER_COMMENT: {
		EN: 'enter your comment here',
		IT: 'inserisci qui il tuo commento'
	},
	
	BLOCK_OPTION_EYES: {
		EN: 'eyes',
		IT: 'eyes'
	},
	
	BLOCK_OPTION_HEAD: {
		EN: 'head',
		IT: 'head'
	},
	
	BLOCK_OPTION_EARS: {
		EN: 'ears',
		IT: 'orecchie'
	},
	
	BLOCK_OPTION_CHEST: {
		EN: 'chest',
		IT: 'chest'
	},
	
	BLOCK_OPTION_FEET: {
		EN: 'feet',
		IT: 'piedi'
	},
	
	BLOCK_OPTION_IGNORE: {
		EN: 'ignore',
		IT: 'ignora'
	},
	
	BLOCK_OPTION_ALLOW: {
		EN: 'allow',
		IT: 'consentire'
	},
	
	BLOCK_OPTION_HELLO: {
		EN: 'Hello',
		IT: 'Hello'
	},
	
	BLOCK_OPTION_MYRECORDING: {
		EN: 'My recording',
		IT: 'La mia registrazione'
	},
	
	BLOCK_OPTION_LIST: {
		EN: 'list',
		IT: 'elenco'
	},
	
	BLOCK_OPTION_FILENAME: {
		EN: 'filename',
		IT: 'nome file'
	},
	
	BLOCK_OPTION_OPEN: {
		EN: 'open',
		IT: 'aperto'
	},
	
	BLOCK_OPTION_CLOSE: {
		EN: 'close',
		IT: 'vicino'
	}
};
