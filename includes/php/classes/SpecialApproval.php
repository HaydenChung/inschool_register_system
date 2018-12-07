<?php

class SpecialApproval {

    protected $user;

    public function __construct() {
        global $user;
        $this->user = $user;
    }

    public function add($studentUid, $typeId, $startTime, $endTime) {
        $values = [
            'type'=> 'special_approval',
            'uid'=> $this->user->uid,
            'status'=> 1,
            'comment' => 1,
            'promote' => 1,
        ];

        $studentEntity = entity_load_single('user', $studentUid);
        $student = entity_metadata_wrapper('user', $studentEntity);
        $startTimestamp = strtotime($startTime);
        $endTimestamp = strtotime($endTime);

        $title = 'Special_Approval-'.$student->field_class->value().'-'.$student->field_class_number->value().'-'.$student->field_english_name->value().'-'.date('Y-m-d', $startTimestamp);

        $entity = entity_create('node', $values);
        $entity->title = $title;
        // $ewrapper = entity_metadata_wrapper('node', $entity);

        // $ewrapper->title->set($title);
        // $ewrapper->body->set('');
        $entity->field_sp_student = [
            LANGUAGE_NONE => [[
                'target_id'=> $student->uid->value()
            ]]
        ];
        $entity->field_sp_type = [
            LANGUAGE_NONE => [[
                'tid'=> $typeId
            ]]
        ];
        $entity->field_duration = [
            LANGUAGE_NONE => [[
                'value'=> $startTimestamp,
                'value2'=> $endTimestamp
            ]]
        ];

        return entity_save('node', $entity);

    }

    public function get($nid) {
        return entity_load('node', $nid);
    }

}