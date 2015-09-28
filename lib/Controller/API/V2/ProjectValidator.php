<?php

class API_V2_ProjectValidator {

  private $api_record ;
  private $id_project ;
  private $project ;
  private $feature ;

  public function getProject() {
    return $this->project;
  }

  public function setFeature( $feature ) {
    $this->feature = $feature ;
  }

  public function __construct( $api_record, $id_project ) {
    $this->api_record = $api_record ;
    $this->id_project = $id_project ;
  }

  public function validate() {
    $this->project = Projects_ProjectDao::findById( $this->id_project );

    if ($this->project == false) {
      return false;
    }

    if (! $this->validateFeatureEnabled() ) {
      return false;
    }

    return $this->inProjectScope() ;
  }

  private function validateFeatureEnabled() {
    return $this->feature == null ||
      $this->project->getOwnerFeature( $this->feature )  ;
  }

  private function inProjectScope() {
    return $this->api_record->getUser()->email == $this->project->id_customer ;
  }
}
