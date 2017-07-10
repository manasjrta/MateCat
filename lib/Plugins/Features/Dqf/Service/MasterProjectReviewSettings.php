<?php
/**
 * Created by PhpStorm.
 * User: fregini
 * Date: 30/05/2017
 * Time: 17:10
 */

namespace Features\Dqf\Service;

use Exception;
use Features\Dqf\Service\Struct\CreateProjectResponseStruct;
use Features\Dqf\Service\Struct\Request\ReviewSettingsRequestStruct;
use Features\Dqf\Service\Struct\Response\ReviewSettingsResponseStruct;
use INIT;
use Log;

class MasterProjectReviewSettings {

    protected $session;

    protected $remoteProject ;

    public function __construct(Session $session, CreateProjectResponseStruct $remoteProject ) {
        $this->session = $session ;
        $this->remoteProject = $remoteProject ;
    }

    public function create( ReviewSettingsRequestStruct $reviewSettingsData ) {

        $reviewSettingsData->sessionId  = $this->session->getSessionId() ;
        $reviewSettingsData->apiKey     = INIT::$DQF_API_KEY ;
        $reviewSettingsData->projectKey = $this->remoteProject->dqfUUID ;

        $client = new Client();
        $client->setSession( $this->session );

        $url = sprintf( '/project/%s/reviewSettings', $this->remoteProject->dqfId ) ;

        $resource = $client->createResource( $url, 'post', [
                'headers'    => $reviewSettingsData->getHeaders(),
                'formData'   => $reviewSettingsData->getParams(),
                'pathParams' => $reviewSettingsData->getPathParams()
        ] ) ;

        $client->curl()->multiExec();

        if ( count( $client->curl()->getErrors() ) > 0 ) {
            throw new Exception('Errors while creating reviewSettings.' .
                    implode(', ', $client->curl()->getAllContents() )
            ) ;
        }


        return new ReviewSettingsResponseStruct(
                json_decode( $client->curl()->getSingleContent($resource), true )
        );

    }

}