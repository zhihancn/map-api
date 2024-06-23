<?php

/*

    Plugin Name: 高德地图插件
    Description: 调用高德地图API，实现wp选点
    Version: 1.0
    Author: 沉疴
    Author URI: youyuzihan.top
*/

if (!defined("ABSPATH"))
    exit;


class gaodeMap
{
    function __construct()
    {
        add_action('init', array($this, 'adminAssests'));
        add_action("admin_menu", array($this, "apiMap"));
        add_action('admin_init', array($this, 'settings'));
        add_action('enqueue_block_editor_assets',array($this, 'myplugin_enqueue_scripts') );
    }

    function apiMap()
    {
        add_menu_page("地图API设置", "地图API", "manage_options", "api-setting-pages", array($this, "apiMapHTML"));
    }

    function settings()
    {
        add_settings_section('wcp_first_section', '子标题', null, "api-setting-pages");

        add_settings_field('wcp_keyApi', 'KEY', array($this, 'apiMapSettingHTML'), 'api-setting-pages', 'wcp_first_section');
        register_setting('apiMapPlugin', 'wcp_keyApi', array('sanitize_callback' => 'sanitize_text_field', 'default' => ''));

        add_settings_field('wcp_securityApi', '安全密钥', array($this, 'securityApiSettingHTML'), 'api-setting-pages', 'wcp_first_section');
        register_setting('apiMapPlugin', 'wcp_securityApi', array('sanitize_callback' => 'sanitize_text_field', 'default' => ''));
    }
    function apiMapSettingHTML()
    { ?>

        <input type="text" name="wcp_keyApi" value="<?php echo esc_attr(get_option("wcp_keyApi")); ?>">
    <?php }

    function securityApiSettingHTML()
    { ?>

        <input type="text" name="wcp_securityApi" value="<?php echo esc_attr(get_option("wcp_securityApi")); ?>">
    <?php }
    function apiMapHTML()
    {
        ?>
        <div class="wrap">
            <h1>文章计数设置</h1>
            <form action="options.php" method="POST">
                <?php
                settings_fields("apiMapPlugin");
                do_settings_sections("api-setting-pages");
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }



    function adminAssests()
    {
        register_block_type(
            __DIR__,
            array(
                'render_callback' => array($this, 'theHTML')
            )
        );
    }
    function theHTML($attribute)
    {
        $attribute['apiKey'] = get_option('wcp_keyApi');
        $attribute['securityKey'] = get_option('wcp_securityApi');
        ob_start(); ?>
        <div class="map-front-page">
            <pre style="display:none;"><?php echo wp_json_encode($attribute) ?></pre>
        </div>
        <?php
        return ob_get_clean();
    }

    function myplugin_enqueue_scripts() {
        // 注册您的脚本
        wp_register_script('myplugin-script', plugins_url('src/index.js', __FILE__), array('wp-blocks', 'wp-element', 'wp-editor'), true);
    
        // 获取数据库数据
        // global $wpdb;
        $results = array(
            "apiKey" => get_option('wcp_keyApi'),
            "securityKey" => get_option('wcp_securityApi'),
        ) ;
    
        // 将数据本地化并传递到 JavaScript 文件中
        wp_localize_script('myplugin-script', 'mypluginData', array(
            'dbData' => $results,
        ));
    
        // 入队脚本
        wp_enqueue_script('myplugin-script');
    }


}

$gaodeMap = new gaodeMap();

?>