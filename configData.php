<?php


/**
 *  
 * It's config store for Config::get. Will get included in init.php.
 * 
 */

$protocol = !empty($_SERVER['HTTPS']) && strcasecmp($_SERVER['HTTPS'], 'on') === 0 ||
        !empty($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
		strcasecmp($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') === 0 ?
		'https://' :
		'http://' ;

$GLOBALS['config'] = [
	'version'=> '1.2.0',
	'root_document'=> __DIR__,
	'http_root'=> $protocol.$_SERVER['HTTP_HOST'],
	'site_name'=> function_exists('variable_get') ? variable_get('site_name', "Default site name") : 'InDev test site',
	//static info of drupal, this is store for standalone page but still requiring drupal's config.
	'drupal'=> [
		'file_public'=> __DIR__.'/atteadmin/sites/atteadmin/files'
	],
	'google_service' => [
		'oauth_token' => '',
		'user_name',
		'calender_list' => [],
		// 'domian' => 'gedu.demo.kanhan.com',
		'scope' => [
			'basic' => 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.me',
			'calendar_write' => 'https://www.googleapis.com/auth/calendar',
			'calendar_read' => 'https://www.googleapis.com/auth/calendar.readonly',
			'resource_write' => 'https://www.googleapis.com/auth/admin.directory.resource.calendar',
			'resource_read' => 'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly',
			'customer_write' => 'https://www.googleapis.com/auth/admin.directory.customer.readonly',
			'customer_read' => 'https://www.googleapis.com/auth/admin.directory.customer',
			'admin_resource'=> 'https://www.googleapis.com/auth/admin.directory.resource.calendar',
			'admin_directory_read'=> 'https://www.googleapis.com/auth/admin.directory.user.readonly',
			'admin_directory_write'=> 'https://www.googleapis.com/auth/admin.directory.user.readonly',
			'group_member_read' => 'https://www.googleapis.com/auth/admin.directory.group.member.readonly',
			'group_read' => 'https://www.googleapis.com/auth/admin.directory.group.readonly',
		]
	],
	'user_role'=>[
		'admin'=> 3,
		'guard'=> 7,
		'staff'=> 6,
		'student'=> 5,
		'teacher'=> 4,
		'coach'=> 10,
		'HoY'=> 9
	],
	'exception_weight'=>[
		'personal'=> 1,
		'office'=> 10
	],
	//Listed page will exclude from any user timeout method
	'user_timeout_exception'=> [
		'eventSubmitJob',
		'google_sync'
	],
	'user_timeout_second'=> 5400,
	'database'=> [
		'info'=> [
			'host'=> '10.104.32.241',
			'port'=> '3306',
			'dbname'=> 'cymcass',
			'user'=> 'cymca',
			'password'=> 'CymCa#123$',
			'default_school_year'=> '1819'
		],
		'operators' =>['>','>=','<','<=','=','<>','<=>','LIKE','IN','NULL','NOT NULL'],
		'table_name' =>[
			'user_log'=> 'school_user_log',
			'real_swipecard'=> 'z_swipecard_log',
			'virtual_swipecard'=> 'z_virtual_swipecard_log',
			'schedule_date'=> 'school_schedule_date',
			'event'=> 'school_all_event',
			'seating_plan'=>'school_seating_plan',
			'smartcard'=> 'school_smartcard_management',
			'order_processing'=> 'school_order_processing',
			'event_record'=> 'school_event_record',
			'late'=> 'school_user_late',
			'activity_monitor'=> 'school_user_activity_monitor',
			'student_penalty_record'=> 'school_student_penalty',
			'exception'=>[
				'adhoc'=>'school_exception_adhoc'
			],
			'join' => [
				'user_activity' => 'school_user_join_activity',
				'user_seating' => 'school_user_join_seating_plan',
				// 'google_event'=> 'school_event_join_google_id',
				'google'=> 'school_entity_join_google',
				'smartcard'=> 'school_user_join_smartcard'
			],
			'view'=> [
				'activity'=> 'school_all_activity',
				'user'=> 'school_user',
				'static_user'=> 'school_user_static',
				'event'=> 'school_all_event_view',
				'today_event'=> 'school_today_event',
				'user_event'=> 'school_user_event_view',
				'today_user_event'=> 'school_today_user_event_view',
				'schedule'=> 'school_schedule',
				'user_seating_plan'=> 'school_seating_plan_static',
				'excepting_card'=> 'school_all_existing_card',
				'school_schedule'=> 'school_schedule_view',
				'time_slot'=> 'school_time_slot',
				'adhoc'=> 'school_all_sp_adhoc_view',
				'user_status'=> 'school_today_user_status',
				'location'=> 'school_location',
				'leave_count'=> 'school_user_leave_count',
				'leave'=> 'school_all_leave_view',
				'holiday'=> 'school_holiday',
			]
		]
	]
];

$GLOBALS['config']['site_map'] = [
	'teacher_login'=> $GLOBALS['config']['http_root'].'/teacherLogin.php',
	'logout'=> $GLOBALS['config']['http_root'].'/logout.php',
	'select_event'=> $GLOBALS['config']['http_root'].'/seating_plan/select_event.php',
	'seating_plan'=> $GLOBALS['config']['http_root'].'/seating_plan/index.php',
	'manage_card'=> $GLOBALS['config']['http_root'].'/manage_card/index.php',
	'manage_event'=> $GLOBALS['config']['http_root'].'/manage_event/manage_event.php',
	'years_handle'=> $GLOBALS['config']['http_root'].'/years_handle.php',
	'big_screen'=> $GLOBALS['config']['http_root'].'/admin_ui/big_screen.php',
	'web_swipecard'=> $GLOBALS['config']['http_root'].'/web_swipecard/index.php',
];
